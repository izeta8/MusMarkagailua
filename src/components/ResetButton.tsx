import React from 'react';
import ResetIcon from '../assets/svg/reset.svg' // Asegúrate de que la ruta sea correcta
import styled from 'styled-components';

const ResetButton = ({ onPress, style = {}}) => {
  const size = 40;
  return (
    <Button onPress={onPress} style={style}>
       <ResetIcon 
        width={size} 
        height={size} 
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

export default ResetButton;
