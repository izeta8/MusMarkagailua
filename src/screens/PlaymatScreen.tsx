import React, { useEffect, useState } from "react";
import { ImageBackground, StyleSheet, Text, View, StatusBar, ToastAndroid, Image, TouchableHighlight } from "react-native";
import styled from 'styled-components/native';
import Immersive from 'react-native-immersive';
import GestureRecognizer, { swipeDirections } from "react-native-swipe-detect";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BasqueText } from "../components/BasqueText";

const chickpeakImages = {
  0: undefined,
  1: require('../assets/chickpeas/chickpeaks_1.png'),
  2: require('../assets/chickpeas/chickpeaks_2.png'),
  3: require('../assets/chickpeas/chickpeaks_3.png'),
  4: require('../assets/chickpeas/chickpeaks_4.png'),
  5: require('../assets/chickpeas/chickpeaks_5.png'),
}

const silverChickpea = require('../assets/chickpeas/silver_chickpea.png')
const chickpeaksMiddle = require('../assets/chickpeas/chickpeaks_middle.png')
const playmatImage = require('../assets/playmat.png');

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

  const [score, setScore] = useState([0,0]); // First index: 0,3. Second index: 1,2
  const [gameScore, setGameScore] = useState([0,0]); // First index: Team 1, Second index: Team 2 

  useEffect(() => {

    // When the player enters the app load the score saved in async storage.
    (async () => {
      try {
        const scoreJSON = await AsyncStorage.getItem('score');
        if (scoreJSON) {
          const parsed = JSON.parse(scoreJSON);
          setScore(parsed.score);
          console.log("Score loaded successfully: ", parsed.score);
        } else {
          console.log("Score not found on AsyncStorage");
        }
      } catch (error) {
        console.error("Error reading score:", error);
      }
    })();

    // Enable immersive mode
    Immersive.on();

    // Cleanup: Disable immersive mode when the component unmounts
    return () => {
      Immersive.off();
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const scoreJSON = {score};
        await AsyncStorage.setItem('score', JSON.stringify(scoreJSON));
        console.log("Score: ", scoreJSON.score);
      } catch (error) {
        console.error("Error saving the score:", error);
      }
    })();
  }, [score]);


  useEffect(() => {
    (async () => {
      try {
        const gameScoreJSON = {gameScore};
        await AsyncStorage.setItem('gameScore', JSON.stringify(gameScoreJSON));
        console.log("Game Score: ", gameScoreJSON.gameScore);
      } catch (error) {
        console.error("Error saving the game score:", error);
      }
    })();
  }, [gameScore]);


  const handleReset = () => {
    setScore([0,0]);
    setGameScore([0,0]);
  }

  // ---------------------- //
  // -----   RENDER   ----- //
  // ---------------------- //

  return (
    <>
      <StatusBar hidden={true} />

      <MainView source={playmatImage}>

        {[...Array(4)].map((element, index) => {
          return <Quarter 
                    key={index}
                    index={index}
                    score={score}
                    setScore={setScore}
                    gameScore={gameScore}
                    setGameScore={setGameScore}
                  />;
        })}

        <ChickpeaksMiddleView>

          <ResetTextButton onPress={handleReset}>
            <ResetText>Reset</ResetText>
          </ResetTextButton>

          <ChickpeaksMiddle source={chickpeaksMiddle} />

        </ChickpeaksMiddleView>
      
      </MainView>
    </>
  );
};


const Quarter = ({index, score, setScore, gameScore, setGameScore}) => {

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

  const increaseGamePoint = () => {
    let newGameScore = [...gameScore];
    newGameScore[teamIndex] = newGameScore[teamIndex]+1;
    setGameScore(newGameScore);
    setScore([0,0]);
  }

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
    <QuarterElement
      borderLeft={[0, 3].includes(index)}
      borderTop={[1, 2].includes(index)}
      style={[
        !isSinglePointQuarter(index) ? styles.rotate : null,
      ]}
    >
      {!isSinglePointQuarter(index) && (
        <GamePointContainer
          position={index===0 ? 'right' : 'left'}
        >

          {[...Array(gameScore[teamIndex])].map((gamePoints, index) => {
            return <GamePointImage key={index} source={silverChickpea} />
          })}

        </GamePointContainer>
      )}

      <GestureRecognizer
        onSwipe={(direction, state) => onSwipe(direction, state)}
        config={gestureConfig}
        style={styles.gestureRecognizer}
      >
        <Tap
          onPress={onTap}
          activeOpacity={1}
          borderColor={index===0 || index===3 ? 'transparent' : 'transparent'}
          borderLeft={[1, 2].includes(index)}
          borderRight={[0, 3].includes(index)}

        >
          <ChickpeaImage teamScore={score[teamIndex]} index={index} />

          {!isSinglePointQuarter(index) && score[teamIndex] === 20 && (

            <AddGamePointButton onPress={increaseGamePoint}>
              <AddGamePointText>Ustela Gehitu</AddGamePointText>
            </AddGamePointButton>
          )}

        </Tap>
        {/* <Text style={styles.text}>{index}</Text> */}
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

const AddGamePointButton = styled.TouchableOpacity`
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, .85);
  border-radius: 3px;
  background: rgba(0,0,0,.2);
`

const AddGamePointText = styled.Text`
  font-family: Vascan;
  font-size: 20px;
  color: rgba(255, 255, 255, .85);
`

const GamePointContainer = styled.View`
  position: absolute;
  ${props => props.position}: 10px;
  background: blue;
  padding: 10px;
  background: rgba(0,0,0,.2);
  border: 1px dashed white;
  margin: 10px 0px;
  height: 72%;
  min-width: 48px;

  flex-wrap: wrap;
  justify-content:center;
  align-items:center;
  gap: 3px;
`

const GamePointImage = styled.Image`
  width: 25px;
  height: 25px;
  resize-mode:contain;
`

const MainView = styled.ImageBackground`
  width: 100%;
  height: 100%;
  flex-direction: row;
  flex-wrap: wrap;
`;

const QuarterElement = styled.View`
  width: 50%;
  height: 50%;
  z-index: 1;

  border-style: dashed;
  border-color: white;

  border-left-width: ${props => props.borderLeft ? '3px' : '0px'};
  border-top-width: ${props => props.borderTop ? '3px' : '0px'};
  border-bottom: 3px dashed white;
`;

const ChickpeaksMiddleView = styled.View`
  position:absolute;
  width: 100%;
  height: 100%;
  justify-content:center;
  align-items:center;
`
const ChickpeaksMiddle = styled.Image`
  width: 200px;
  height: 200px;
  resize-mode:contain;
  z-index:2;
`
const ResetTextButton = styled.TouchableOpacity`
  z-index: 3;
  background: rgba(0,0,0,.5);
  color: white;
  border: 1px solid white;
  padding: 8px;
  border-radius: 3px;
  position: absolute;
  `
  const ResetText = styled.Text`
  font-size: 20px;
  font-family: Vascan;
  color: white;
`

const Chickpea = styled.Image.attrs({
  fadeDuration: 0
})`
  width: 70px;
  resize-mode: contain;
`

const Tap = styled.TouchableOpacity`
  width:100%;
  height:100%;
  justify-content:center;
  align-items:center;

  border-bottom-width: 1px;
  border-color: ${props => props.borderColor};
  border-left-width: ${props => props.borderLeft ? '1px' : '0px'};
  border-right-width: ${props => props.borderRight ? '1px' : '0px'};
`

const QuarterValueText = styled.Text`
  color: white;  
  font-family: Vascan;
  position: absolute;
  bottom: 10px;
  font-style:italic;
  font-weight: bold;
  font-size: 20px;
  opacity: .5;
  ${props => [0,3].includes(props.index) ? 'right' : 'left'}: 20px;
`

const styles = StyleSheet.create({
  gestureRecognizer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rotate: {
    transform: [{rotate: '180deg'}]
  },
});