import { useState } from "react";
import styled from "styled-components";

const Clock = () => {

  const [time, setTime] = useState<string | null >(null);

  setInterval(() => {
    const currentDate = new Date();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    setTime(`${hours}:${minutes}`);
  }, 1000);

  return (
    <>
      {time && (
        <ClockView>
          <ClockText>{time}</ClockText>
        </ClockView>
      )}
    </>
  )
}

// -----   CLOCK   ----- //

const ClockView = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
`

const ClockText = styled.Text`
  color: white;
  position: absolute;
  opacity: .8;
  bottom: 35%;
  transform: rotate(270deg);
  font-family: Kaxko;
  font-size: 18px;
`

export default Clock;