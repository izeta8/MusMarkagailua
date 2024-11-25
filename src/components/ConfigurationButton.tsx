import React from 'react';
import SettingsIcon from '../assets/svg/settings.svg' // Asegúrate de que la ruta sea correcta
import styled from 'styled-components';

const ConfigurationButton = ({ onPress, style = {}}) => {
  const size = 40;
  return (
    <Button onPress={onPress} style={style}>
       <SettingsIcon 
        width={size} 
        height={size} 
        fill='#e3dcdc' 
      />
    </Button>
  );
};

const Button = styled.TouchableOpacity`
  padding: 10px;
  align-items: center;
  justify-content: center;
  z-index: 99;
`

export default ConfigurationButton;
