import React, { useState, useEffect } from 'react';
import './styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding,
  faMapMarkerAlt,
  faUser,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Progress, Image, Box } from '@chakra-ui/react';

const images = {
  loaded: [
    'Fleet.jpg',
    'GPS.jpg',
    'logistics.jpg',
    'vidange.jpg',
    'background.jpg',
  ],
  loading: [
    'processed_images/Fleet_processed.jpg',
    'processed_images/GPS_processed.jpg',
    'processed_images/logistics_processed.jpg',
    'processed_images/vidange_processed.jpg',
    'processed_images/background_processed.jpg',
  ],
};

const Login = () => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  const [isLoadingSites, setIsLoadingSites] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [sites, setSites] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedSite, setSelectedSite] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/Dashboard');
    }
    setIsLoadingCompanies(true);
    axios
      .get(
        'https://timserver.northeurope.cloudapp.azure.com/GmaoProWebApi/api/authorize/companies'
      )
      .then((response) => {
        setCompanies(response.data || []);
        if (response.data && response.data.length > 0) {
          setSelectedCompany(response.data[0].id);
        }
      })
      .catch((error) => {
        console.error('Error fetching companies:', error);
      })
      .finally(() => {
        setIsLoadingCompanies(false);
      });
  }, [navigate]);

  useEffect(() => {
    if (selectedCompany) {
      setIsLoadingSites(true);
      axios
        .get(
          `https://timserver.northeurope.cloudapp.azure.com/GmaoProWebApi/api/authorize/${selectedCompany}/SitesByCompany`
        )
        .then((response) => {
          setSites(response.data || []);
          if (response.data && response.data.length > 0) {
            setSelectedSite(response.data[0].id);
          }
        })
        .catch((error) => {
          console.error('Error fetching sites:', error);
        })
        .finally(() => {
          setIsLoadingSites(false);
        });
    } else {
      setSites([]);
    }
  }, [selectedCompany]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % images.loaded.length
      );
    }, 4000); // Change image every 4 seconds
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://timserver.northeurope.cloudapp.azure.com/GmaoProWebApi/token',
        {
          grant_type: 'password',
          username: user,
          password: password,
          companyId: selectedCompany,
          siteId: selectedSite,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
          },
        }
      );
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('name', user);
      navigate('/Dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed: Incorrect username or password.');
    }
  };

  return (
    <Box
      className="login-wrapper"
      position="relative"
      w="100vw"
      h="100vh"
      overflow="hidden"
    >
      {images.loaded.map((im, index) => (
        <Image
          key={index}
          src={im}
          fallbackSrc={images.loading[index]}
          alt="background"
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          w="100%"
          h="100%"
          objectFit="cover"
          transition="opacity 1s"
          opacity={index === currentImageIndex ? 1 : 0}
        />
      ))}
      <Box className="login-form" position="relative" zIndex={1}>
        {(isLoadingCompanies || isLoadingSites || !selectedCompany) && (
          <Progress size="xs" isIndeterminate w="full" mb="2" />
        )}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faBuilding} />
                </span>
              </div>
              <select
                className="form-control"
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
              >
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                </span>
              </div>
              <select
                className="form-control"
                value={selectedSite}
                onChange={(e) => setSelectedSite(e.target.value)}
              >
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faUser} />
                </span>
              </div>
              <input
                type="text"
                className="form-control"
                placeholder="Utilisateur"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faLock} />
                </span>
              </div>
              <input
                type="password"
                className="form-control"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            Connexion
          </button>
        </form>
      </Box>
    </Box>
  );
};

export default Login;
