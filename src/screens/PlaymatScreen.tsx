import React, { useEffect, useState } from "react";
import { ImageBackground, StyleSheet, Text, View, StatusBar, ToastAndroid, Image, TouchableHighlight } from "react-native";
import styled from 'styled-components/native';
import Immersive from 'react-native-immersive';
import GestureRecognizer, { swipeDirections } from "react-native-swipe-detect";

const chickpeakImages = {
  0: undefined,
  1: require('../assets/chickpeas/chickpeaks_1.png'),
  2: require('../assets/chickpeas/chickpeaks_2.png'),
  3: require('../assets/chickpeas/chickpeaks_3.png'),
  4: require('../assets/chickpeas/chickpeaks_4.png'),
  5: require('../assets/chickpeas/chickpeaks_5.png'),
}

const chickpeaksMiddle = require('../assets/chickpeas/chickpeaks_middle.png')

const gestureConfig = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 80,
};

const quarterPointValue = (index) => {
  return isSinglePointQuarter(index) ? 1 : 5;
}

// ----------------------- //
// -----   UTILITY   ----- //
// ----------------------- //

const isSinglePointQuarter = (index) => {
  return [2,3].includes(index);
} 

const getTeamIndex = (index) => {
  return index === 0 || index === 3 ? 0 : 1; 
}

export default function PlaymatScreen(): React.JSX.Element {

  const [score, setScore] = useState([0,0]); // First index: 1,3. Second index: 1,2 

  useEffect(() => {
    console.log("Score: ", score);
    // calculateTeamScores();
  }, [score]);
  
  useEffect(() => {
    // Enable immersive mode
    Immersive.on();

    // Cleanup: Disable immersive mode when the component unmounts
    return () => {
      Immersive.off();
    };
  }, []);

  // ----------------------- //
  // -----   UTILITY   ----- //
  // ----------------------- //

  return (
    <>
      <StatusBar hidden={true} />
      <MainView resizeMode="contain">

        {[...Array(4)].map((element, index) => {
          return <Quarter key={index} index={index} score={score} setScore={setScore} />;
        })}

        <ChickpeaksMiddleView>
          {/* <ChickpeaksMiddle source={chickpeaksMiddle} /> */}
        </ChickpeaksMiddleView>

        <PlaymatBackground />
      </MainView>
    </>
  );
};

const Quarter = ({index, score, setScore}) => {

  const teamIndex = getTeamIndex(index);
  const pointValue = quarterPointValue(index);

  // ----------------------- //
  // -----   UTILITY   ----- //
  // ----------------------- //

  const increaseScore = () => {
    let newTeamScore = score[teamIndex]+pointValue;
    if (newTeamScore>=20) {newTeamScore = 20}
    let newScore = [...score];
    newScore[teamIndex] = newTeamScore; 
    setScore(newScore);
  }

  const decreaseScore = () => {
    let newTeamScore = score[teamIndex]-pointValue;
    if (newTeamScore<=0) {newTeamScore = 0}
    let newScore = [...score];
    newScore[teamIndex] = newTeamScore; 
    setScore(newScore);
  };

  // ----------------------- //
  // -----   GESTURE   ----- //
  // ----------------------- //

  const onTap = () => {
    increaseScore();
  }

  const onSwipe = (direction, state) => {

    // Get rid of LEFT and RIGHT swipes.
    if (direction !== swipeDirections.SWIPE_UP && direction !== swipeDirections.SWIPE_DOWN) return;

    if (index === 0 || index === 1) {
      direction = direction === swipeDirections.SWIPE_UP ? swipeDirections.SWIPE_DOWN : swipeDirections.SWIPE_UP;
    }  
    
    switch (direction) {
      case swipeDirections.SWIPE_UP:
        increaseScore();
        break;
      case swipeDirections.SWIPE_DOWN:
        decreaseScore();
        break;
      default:

    }
  };

  // ----------------------- //
  // -----   RENDER   ----- //
  // ----------------------- //

  return (
    <QuarterElement color="red" style={[[0,1].includes(index) ? styles.rotate : undefined]} >
      <GestureRecognizer
        onSwipe={(direction, state) => onSwipe(direction, state)}
        config={gestureConfig}
        style={styles.gestureRecognizer}
      >
        <Tap onPress={onTap} activeOpacity={1} style={index===0 || index===3 ? styles.blue : styles.red}>
          <ChickpeaImage teamScore={score[teamIndex]} index={index} />
        </Tap>
        {/* <Text style={{textAlign:'center', position: 'absolute'}}>{index}</Text> */}
        <QuarterValueText index={index}>{isSinglePointQuarter(index) ? '1' : '5'}</QuarterValueText>
      </GestureRecognizer>
    </QuarterElement>
  )
}

const ChickpeaImage = ({teamScore, index}) => {

  let cheackpeaImageIndex;

  if (isSinglePointQuarter(index)) {
    cheackpeaImageIndex = teamScore%5;
  } 
  
  if (!isSinglePointQuarter(index)) {
    cheackpeaImageIndex = Math.trunc(teamScore/5);
  }

  return (
    <>
      {teamScore ? (
        <Chickpea source={chickpeakImages[cheackpeaImageIndex]} />
      ) 
      : null
      }
    </>
  );

}

// ---------------------- //
// -----   STYLES   ----- //
// ---------------------- //

const MainView = styled.ImageBackground`
  width: 100%;
  height: 100%;
  flex-direction: row;
  flex-wrap: wrap;
`;

const QuarterElement = styled.View`
  width: 50%;
  height: 50%;
  background: transparent;

  border: 1px dashed white;
`;
  // border-style: dashed;
  // border-color: white;
  // border-bottom-width: ${props => props.borderBottom ? '2px' : '0px'};
  // border-top-width: ${props => props.borderTop ? '2px' : '0px'};
  // border-right-width: ${props => props.borderRight ? '2px' : '0px'};
  // border-left-width: ${props => props.borderLeft ? '2px' : '0px'};

const ChickpeaksMiddleView = styled.View`
  position:absolute;
  width: 100%;
  height: 100%;
  justify-content:center;
  align-items:center;
  z-index:-1;
`
const ChickpeaksMiddle = styled.Image`
  width: 50%;
  height: 50%;
  resize-mode:contain;
`

const PlaymatBackground = styled.View `
  position:absolute;
  width: 100%;
  height: 100%;
  background: green;
  z-index:-2;
` 

const Chickpea = styled.Image`
  width: 70px;
  resize-mode: contain;
`

const Tap = styled.TouchableOpacity`
  width:100%;
  height:100%;
  justify-content:center;
  align-items:center;
  border-style: solid;
`
  // border-bottom-width: 3px;

const QuarterValueText = styled.Text`
  position: absolute;
  ${props => [0,3].includes(props.index) ? 'right' : 'left'}: 20px;
  bottom: 10px;
  font-style:italic;
  font-weight: bold;
  font-size: 20px;
  opacity: .5;
`

const styles = StyleSheet.create({
  gestureRecognizer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  }, 
  blue: {
    borderColor: 'blue',
  },
  red: {
    borderColor: 'red',
  },
  rotate: {
    transform: [{rotate: '180deg'}]
  }
});