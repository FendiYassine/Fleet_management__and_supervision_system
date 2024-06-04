// Filename - components/SidebarData.js

import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import * as GiIcons from "react-icons/gi";

export const SidebarData = [
  {
    title: 'Tableau de bord',
    path: '/Dashboard',
    icon: <AiIcons.AiFillDashboard />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
  },
  {
    title: 'Equipements',
    path: '/Equipements',
    icon: <FaIcons.FaCar />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Ajouter un équipement',
        path: '/Equipements/AjouterEquipement',
        icon: <IoIcons.IoMdAddCircle />,
        cName: 'sub-nav',
      },
      {
        title: 'Consulter la liste des équipements',
        path: '/Equipements/ConsulterEquipement',
        icon: <FaIcons.FaRegListAlt />,
        cName: 'sub-nav',
      },
    ],
  },
  
  {
    title: 'Maintenance',
    path: '/maintenances',
    icon: <GiIcons.GiAutoRepair  />,

    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Programmer une intervention',
        path: '/maintenances/ProgrammerIntervention',
        icon: <AiIcons.AiFillSchedule  />,
        cName: 'sub-nav',
      },
      {
        title: 'Suivi des opérations de maintenance',
        path: '/maintenances/SuiviMaintenance',
        icon: <FaIcons.FaListAlt  />,
        cName: 'sub-nav',
      },
    ],
  },


  {
    title: 'Gestion du carburant',
    path: '/carburant',
    icon: <FaIcons.FaGasPump  />,

    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: "Ajouter une opération d'approvisionnement",
        path: '/carburant/AjouterCarburant',
        icon: <AiIcons.AiFillSchedule  />,
        cName: 'sub-nav',
      },
      {
        title: "Suivi des opérations de d'approvisionnement",
        path: '/carburant/SuiviCarburant',
        icon: <FaIcons.FaListAlt  />,
        cName: 'sub-nav',
      },
    ],
  },

  {
    title: 'Contact',
    path: '/contact',
    icon: <FaIcons.FaPhone />,
  },
];
