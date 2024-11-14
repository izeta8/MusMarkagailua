import React, { useEffect, useState } from "react";
import { ImageBackground, StyleSheet, Text, View, StatusBar, ToastAndroid, Image, TouchableHighlight } from "react-native";
import styled from 'styled-components/native';
import Immersive from 'react-native-immersive';
import GestureRecognizer, { swipeDirections } from "react-native-swipe-detect";

const chickpeak_images = {
  0: undefined,
  1: require('../assets/chickpeas/chickpeaks_1.png'),
  2: require('../assets/chickpeas/chickpeaks_2.png'),
  3: require('../assets/chickpeas/chickpeaks_3.png'),
  4: require('../assets/chickpeas/chickpeaks_4.png'),
  5: require('../assets/chickpeas/chickpeaks_5.png'),
}

const gestureConfig = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 80,
};

const max_score = [4, 4, 5, 5];

// ----------------------- //
// -----   UTILITY   ----- //
// ----------------------- //

const isSinglePointQuarter = (index) => {
  return [2,3].includes(index);
} 

const quarterPointValue = (index) => {
  return isSinglePointQuarter(index) ? 1 : 5;
}

export default function PlaymatScreen(): React.JSX.Element {

  const [teamScore, setTeamScore] = useState([0,0]);
  const [individualScore, setIndividualScore] = useState([0,0,0,0]);

  useEffect(() => {
    console.log("Individual Score: ", individualScore);
    calculateTeamScores();
  }, [individualScore]);
  
  useEffect(() => {
    console.log("Team Score: ", teamScore);
  }, [teamScore]);

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

  const calculateTeamScores = () => {
    let team1 = individualScore[0]*quarterPointValue(0) + individualScore[3]*quarterPointValue(3); 
    let team2 = individualScore[1]*quarterPointValue(1) + individualScore[2]*quarterPointValue(2);
    setTeamScore([team1, team2]); 
  }

  return (
    <>
      <StatusBar hidden={true} />
      <MainView resizeMode="contain"  source={require('../assets/playmat.png')}>

        {individualScore.map((element, index) => {
          return <Quarter key={index} index={index} individualScore={individualScore} setIndividualScore={setIndividualScore} />;
        })}

      </MainView>
    </>
  );
};

const Quarter = ({index, individualScore, setIndividualScore}) => {

  const [quarterScore, setQuarterScore] = useState(0);

  useEffect(() => {
    let newScore = [...individualScore];
    newScore[index] = quarterScore;  
    setIndividualScore(newScore);
  }, [quarterScore]);

  // ----------------------- //
  // -----   UTILITY   ----- //
  // ----------------------- //

  const increaseQuarterScore = () => {
    
    if (isSinglePointQuarter(index)) {
    }

    // Check if the cuarter score passes from its limit
    if (quarterScore === max_score[index]) {
      
      return
    }
    setQuarterScore(quarterScore+1);
  }

  const decreaseQuarterScore = () => {
    if (quarterScore === 0) {return}
    setQuarterScore(quarterScore-1);
  };

  // ----------------------- //
  // -----   GESTURE   ----- //
  // ----------------------- //

  const onTap = () => {
    console.log('TAPPED');
    increaseQuarterScore();
  }

  const onSwipe = (direction, state) => {

    // Get rid of LEFT and RIGHT swipes.
    if (direction !== swipeDirections.SWIPE_UP && direction !== swipeDirections.SWIPE_DOWN) return;

    if (index === 0 || index === 1) {
      direction = direction === swipeDirections.SWIPE_UP ? swipeDirections.SWIPE_DOWN : swipeDirections.SWIPE_UP;
    }  
    
    switch (direction) {
      case swipeDirections.SWIPE_UP:
        increaseQuarterScore();
        break;
      case swipeDirections.SWIPE_DOWN:
        decreaseQuarterScore();
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
          {quarterScore !== undefined && <Chickpea source={chickpeak_images[quarterScore]} /> }
        </Tap>
        {/* <Text style={{textAlign:'center', position: 'absolute'}}>{index}</Text> */}
      </GestureRecognizer>
    </QuarterElement>
  )
  
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
  background: green;

  border: 1px dashed white;
`;
  // border-style: dashed;
  // border-color: white;
  // border-bottom-width: ${props => props.borderBottom ? '2px' : '0px'};
  // border-top-width: ${props => props.borderTop ? '2px' : '0px'};
  // border-right-width: ${props => props.borderRight ? '2px' : '0px'};
  // border-left-width: ${props => props.borderLeft ? '2px' : '0px'};

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