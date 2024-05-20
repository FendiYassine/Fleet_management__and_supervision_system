
// import React, { useState, useEffect } from 'react';
// import './styles.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {
//   faBuilding,
//   faMapMarkerAlt,
//   faUser,
//   faLock,
// } from '@fortawesome/free-solid-svg-icons';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const Login = () => {
//   const [user, setUser] = useState('');
//   const [password, setPassword] = useState('');
//   const [companies, setCompanies] = useState([]);
//   const [sites, setSites] = useState([]);
//   const [selectedCompany, setSelectedCompany] = useState('');
//   const [selectedSite, setSelectedSite] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios
//       .get(
//         'https://timserver.northeurope.cloudapp.azure.com/GmaoProWebApi/api/authorize/companies'
//       )
//       .then((response) => {
//         setCompanies(response.data || []);
//         if (response.data && response.data.length > 0) {
//           setSelectedCompany(response.data[0].id);
//         }
//       })
//       .catch((error) => {
//         console.error('Error fetching companies:', error);
//       });
//   }, []);

//   useEffect(() => {
//     if (selectedCompany) {
//       axios
//         .get(
//           `https://timserver.northeurope.cloudapp.azure.com/GmaoProWebApi/api/authorize/${selectedCompany}/SitesByCompany`
//         )
//         .then((response) => {
//           setSites(response.data || []);
//           if (response.data && response.data.length > 0) {
//             setSelectedSite(response.data[0].id);
//           }
//         })
//         .catch((error) => {
//           console.error('Error fetching sites:', error);
//         });
//     } else {
//       setSites([]);
//     }
//   }, [selectedCompany]);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       console.log("Data passed to get token access : ",user ,".....", password, ".....", selectedCompany, ".....", selectedSite);
//       const response = await axios.post(
//         'https://timserver.northeurope.cloudapp.azure.com/GmaoProWebApi/token',
//         {
//           'grant_type': 'password',
//           'username': user,
//           'password': password,
//           'companyId': selectedCompany,
//           'siteId': selectedSite,
//         },
//         {
//           headers: {
//             'Content-Type': 'application/x-www-form-urlencoded', 
//             Accept: 'application/json',
//           },
//         }
//       );
//       const { access_token } = response.data;
//       localStorage.setItem('token', access_token);
//       navigate('/Dashboard');
//     } catch (error) {
//       console.error('Login failed:', error);
//       alert('Login failed: Incorrect username or password.');
//     }
//   };

//   return (
//     <div className="login-wrapper">
//       <div className="background-image"></div>
//       <div className="login-form">
//         <form onSubmit={handleLogin}>
//           <div className="form-group">
//             <div className="input-group">
//               <div className="input-group-prepend">
//                 <span className="input-group-text">
//                   <FontAwesomeIcon icon={faBuilding} />
//                 </span>
//               </div>
//               <select
//                 className="form-control"
//                 value={selectedCompany}
//                 onChange={(e) => setSelectedCompany(e.target.value)}
//               >
//                 {companies.map((company) => (
//                   <option key={company.id} value={company.id}>
//                     {company.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//           <div className="form-group">
//             <div className="input-group">
//               <div className="input-group-prepend">
//                 <span className="input-group-text">
//                   <FontAwesomeIcon icon={faMapMarkerAlt} />
//                 </span>
//               </div>
//               <select
//                 className="form-control"
//                 value={selectedSite}
//                 onChange={(e) => setSelectedSite(e.target.value)}
//               >
//                 {sites.map((site) => (
//                   <option key={site.id} value={site.id}>
//                     {site.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//           <div className="form-group">
//             <div className="input-group">
//               <div className="input-group-prepend">
//                 <span className="input-group-text">
//                   <FontAwesomeIcon icon={faUser} />
//                 </span>
//               </div>
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Utilisateur"
//                 value={user}
//                 onChange={(e) => setUser(e.target.value)}
//                 required
//               />
//             </div>
//           </div>
//           <div className="form-group">
//             <div className="input-group">
//               <div className="input-group-prepend">
//                 <span className="input-group-text">
//                   <FontAwesomeIcon icon={faLock} />
//                 </span>
//               </div>
//               <input
//                 type="password"
//                 className="form-control"
//                 placeholder="Mot de passe"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>
//           </div>
//           <button type="submit" className="btn btn-primary btn-block">
//             Connexion
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;


import React, { useState, useEffect } from 'react';
import './styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faMapMarkerAlt, faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [companies, setCompanies] = useState([]);
  const [sites, setSites] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedSite, setSelectedSite] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Here you might want to validate the token by making an API call
      // If valid:
      navigate('/Dashboard');
    }
    axios.get('https://timserver.northeurope.cloudapp.azure.com/GmaoProWebApi/api/authorize/companies')
      .then(response => {
        setCompanies(response.data || []);
        if (response.data && response.data.length > 0) {
          setSelectedCompany(response.data[0].id);
        }
      })
      .catch(error => {
        console.error('Error fetching companies:', error);
      });
  }, [navigate]);

  useEffect(() => {
    if (selectedCompany) {
      axios.get(`https://timserver.northeurope.cloudapp.azure.com/GmaoProWebApi/api/authorize/${selectedCompany}/SitesByCompany`)
        .then(response => {
          setSites(response.data || []);
          if (response.data && response.data.length > 0) {
            setSelectedSite(response.data[0].id);
          }
        })
        .catch(error => {
          console.error('Error fetching sites:', error);
        });
    } else {
      setSites([]);
    }
  }, [selectedCompany]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://timserver.northeurope.cloudapp.azure.com/GmaoProWebApi/token', {
        grant_type: 'password',
        username: user,
        password: password,
        companyId: selectedCompany,
        siteId: selectedSite,
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
      });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      navigate('/Dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed: Incorrect username or password.');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="background-image"></div>
      <div className="login-form">
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
                onChange={e => setSelectedCompany(e.target.value)}
              >
                {companies.map(company => (
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
                onChange={e => setSelectedSite(e.target.value)}
              >
                {sites.map(site => (
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
                onChange={e => setUser(e.target.value)}
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
      </div>
    </div>
  );
};

export default Login;