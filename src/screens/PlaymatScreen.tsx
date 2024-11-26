import React, { useEffect, useState } from "react";
import { StyleSheet, StatusBar, View, Text, Touchable, TouchableOpacity } from "react-native";
import styled from 'styled-components/native';
import Immersive from 'react-native-immersive';
import GestureRecognizer, { swipeDirections } from "react-native-swipe-detect";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConfigurationButton from "../components/ConfigurationButton";
import ResetButton from "../components/ResetButton";
import {ResetModal, SettingsModal} from "../components/Modals"
import Clock from "../components/Clock";

// ---------------------- //
// -----   IMAGES   ----- //
// ---------------------- //

const chickpeakImages = {
  0: undefined,
  1: require('../assets/chickpeas/chickpeaks_1.png'),
  2: require('../assets/chickpeas/chickpeaks_2.png'),
  3: require('../assets/chickpeas/chickpeaks_3.png'),
  4: require('../assets/chickpeas/chickpeaks_4.png'),
  5: require('../assets/chickpeas/chickpeaks_5.png'),
  6: require('../assets/chickpeas/chickpeaks_6.png'),
  7: require('../assets/chickpeas/chickpeaks_7.png'),
  8: require('../assets/chickpeas/chickpeaks_8.png'),
}

const playmatImage = require('../assets/textures/playmat.png');
const silverChickpea = require('../assets/chickpeas/silver_chickpea.png')
const chickpeaksMiddle = require('../assets/chickpeas/chickpeaks_middle.png')

const gestureConfig = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 80,
};

const pointTypes = {
  "REGULAR_POINT": "REGULAR_POINT",
  "GAME_POINT": "GAME_POINT",
}

// ----------------------- //
// -----   UTILITY   ----- //
// ----------------------- //

const quarterPointValue = (index) => {
  return isSinglePointQuarter(index) ? 1 : 5;
}

const isSinglePointQuarter = (index) => {
  return [2,3].includes(index);
}

const getTeamIndex = (index) => {
  return index === 0 || index === 3 ? 0 : 1;
}

// -------------------------------------------------------- //

export default function PlaymatScreen(): React.JSX.Element {

  const [score, setScore] = useState([0,0]); // First index: 0,3. Second index: 1,2
  const [gameScore, setGameScore] = useState([0,0]); // First index: Team 1, Second index: Team 2 
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [maxScore, setMaxScore] = useState(20);  
  const [loaded, setLoaded] = useState(false); // Nuevo estado para seguimiento de carga

  useEffect(() => {

    // When the player enters the app load the score saved in async storage.
    (async () => {
      try {

        // -- Max Score -- //
        const maxScoreJSON = await AsyncStorage.getItem("maxScore");
        if (maxScoreJSON) {
          const parsed = JSON.parse(maxScoreJSON);
          setMaxScore(parsed.maxScore);
          console.log("Max score loaded successfully: ", parsed.maxScore);
        } else {
          console.log("Max score not found on AsyncStorage");
        }

        // -- Regular Score -- // 
        const scoreJSON = await AsyncStorage.getItem('score');
        if (scoreJSON) {
          const parsed = JSON.parse(scoreJSON);
          setScore(parsed.score);
          console.log("Score loaded successfully: ", parsed.score);
        } else {
          console.log("Score not found on AsyncStorage");
        }
        
        // -- Game Score -- // 
        const gameScoreJSON = await AsyncStorage.getItem('gameScore');
        if (gameScoreJSON) {
          const parsed = JSON.parse(gameScoreJSON);
          setGameScore(parsed.gameScore);
          console.log("Game Score loaded successfully: ", parsed.gameScore);
        } else {
          console.log("Game Score not found on AsyncStorage");
        }

      } catch (error) {
        console.error("Error reading score:", error);
      } finally {
        setLoaded(true); // Indicamos que la carga ha finalizado
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
    if (!loaded) return;
    (async () => {
      try {
        const maxScoreJSON = { maxScore };
        await AsyncStorage.setItem("maxScore", JSON.stringify(maxScoreJSON));
        console.log("Max Score saved: ", maxScoreJSON.maxScore);
      } catch (error) {
        console.error("Error saving the max score:", error);
      }
    })();

    // Handle max points (settings change)
    let newScore = score.map(teamScore => {
      if (teamScore>maxScore) {
        teamScore = maxScore;
      }
      return teamScore;
    });
    setScore(newScore);

  }, [maxScore]);

  
  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try {
        const scoreJSON = { score };
        await AsyncStorage.setItem("score", JSON.stringify(scoreJSON));
        console.log("Score saved: ", scoreJSON.score);
      } catch (error) {
        console.error("Error saving the score:", error);
      }
    })();
  }, [score, loaded]);

  useEffect(() => {
    if (!loaded) return; 
    (async () => {
      try {
        const gameScoreJSON = { gameScore };
        await AsyncStorage.setItem("gameScore", JSON.stringify(gameScoreJSON));
        console.log("Game Score saved: ", gameScoreJSON.gameScore);
      } catch (error) {
        console.error("Error saving the game score:", error);
      }
    })();
  }, [gameScore, loaded]); // Agrega 'loaded' como dependencia


  // ---------------------- //
  // -----   RENDER   ----- //
  // ---------------------- //

  return (
    <>
      <StatusBar hidden={true} />

      <CenteredView>
        <SettingsModal 
          modalVisible={settingsModalVisible}
          setModalVisible={setSettingsModalVisible}
          maxScore={maxScore}
          setMaxScore={setMaxScore}
        />
        <ResetModal
          modalVisible={resetModalVisible}
          setModalVisible={setResetModalVisible}
          setScore={setScore}
          setGameScore={setGameScore}
        />
      </CenteredView>

      <Clock />

      <CenteredView>
        <ConfigurationButton 
          onPress={() => {setSettingsModalVisible(true)}}
        />
        <ResetButton 
          onPress={() => {setResetModalVisible(true)}}
        />
      </CenteredView>

      <CenteredView>
        <ChickpeaksMiddle source={chickpeaksMiddle} />
      </CenteredView>
    
      <MainView source={playmatImage}>

        {[...Array(4)].map((element, index) => {
          return <Quarter 
                    key={index}
                    index={index}
                    score={score}
                    setScore={setScore}
                    gameScore={gameScore}
                    setGameScore={setGameScore}
                    maxScore={maxScore}
                  />;
        })}

      </MainView>

    </>
  );
};

const Quarter = ({index, score, setScore, gameScore, setGameScore, maxScore})  => {

  const teamIndex = getTeamIndex(index);
  const pointValue = quarterPointValue(index);

  // ----------------------- //
  // -----   UTILITY   ----- //
  // ----------------------- //

  const increaseScore = () => {
    let newTeamScore = score[teamIndex]+pointValue;
    if (newTeamScore>=maxScore) {newTeamScore = maxScore}
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

  const increaseGamePoint = (reset = true) => {
    let newGameScore = [...gameScore];
    newGameScore[teamIndex] = newGameScore[teamIndex]+1;
    setGameScore(newGameScore);
    if (reset) {
      setScore([0,0]);
    }
  }

  const decreaseGamePoint = (reset = true) => {
    let newTeamScore = gameScore[teamIndex]-1;
    if (newTeamScore<=0) {newTeamScore = 0}
    let newScore = [...gameScore];
    newScore[teamIndex] = newTeamScore;
    setGameScore(newScore);
    if (reset) {
      setScore([0,0]);
    }
  }

  // ----------------------- //
  // -----   GESTURE   ----- //
  // ----------------------- //

  const onTap = (pointType) => {

    if (pointType === pointTypes.REGULAR_POINT) {
      increaseScore();
    }

    if (pointType === pointTypes.GAME_POINT) {
      increaseGamePoint(false);
    }
  }
  
  const onSwipe = (direction, state, pointType) => {

    // Get rid of LEFT and RIGHT swipes.
    if (direction !== swipeDirections.SWIPE_UP && direction !== swipeDirections.SWIPE_DOWN) return;

    if (index === 0 || index === 1) {
      direction = direction === swipeDirections.SWIPE_UP ? swipeDirections.SWIPE_DOWN : swipeDirections.SWIPE_UP;
    }

    switch (direction) {
      case swipeDirections.SWIPE_UP:

        if (pointType === pointTypes.REGULAR_POINT) {
          increaseScore();
        }

        if (pointType === pointTypes.GAME_POINT) {
          increaseGamePoint(false);
        }

        break;
      case swipeDirections.SWIPE_DOWN:

        if (pointType === pointTypes.REGULAR_POINT) {
          decreaseScore();
        }

        if (pointType === pointTypes.GAME_POINT) {
          decreaseGamePoint(false);
        }

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
        
        <GestureRecognizer
          onSwipe={(direction, state) => onSwipe(direction, state, pointTypes.GAME_POINT)}
          config={gestureConfig}
          style={[
            styles.gamePointGestureRecognizer,
            index === 0 ? styles.positionRight : styles.positionLeft
          ]}
          
        >
          <GamePointContainer
            position={index===0 ? 'right' : 'left'}
          >

            <Tap
              onPress={() => onTap(pointTypes.GAME_POINT)}
              style={{flexWrap: 'wrap'}}
              activeOpacity={1}
            >

              {[...Array(gameScore[teamIndex])].map((gamePoints, index) => {
                return <GamePointImage key={index} source={silverChickpea} />
              })}

            </Tap>

          </GamePointContainer>
        </GestureRecognizer>
      )}

      <GestureRecognizer
        onSwipe={(direction, state) => onSwipe(direction, state, pointTypes.REGULAR_POINT)}
        config={gestureConfig}
        style={styles.gestureRecognizer}
      >
        <Tap
          onPress={() => onTap(pointTypes.REGULAR_POINT)}
          activeOpacity={1}
          borderColor={index===0 || index===3 ? 'transparent' : 'transparent'}
          borderLeft={[1, 2].includes(index)}
          borderRight={[0, 3].includes(index)}

        >
          <ChickpeaImage teamScore={score[teamIndex]} index={index} />

          {!isSinglePointQuarter(index) && score[teamIndex] === maxScore && (

            <AddGamePointButton onPress={increaseGamePoint}>
              <AddGamePointText>Ustela Gehitu</AddGamePointText>
            </AddGamePointButton>
          )}

        </Tap>

        <QuarterValueText index={index} position={[0,3].includes(index) ? 'right' : 'left'}>
          {isSinglePointQuarter(index) ? '1' : '5'}
        </QuarterValueText>

      </GestureRecognizer>
    </QuarterElement>

  )
}

const ChickpeaImage = ({teamScore, index}) => {

  let cheackpeaImageIndex = isSinglePointQuarter(index) ? teamScore%5 : Math.trunc(teamScore/5);

  if (teamScore) {
    return (
      <Chickpea source={chickpeakImages[cheackpeaImageIndex]} />
    );
  }

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

const CenteredView = styled.View`
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

// -----   QUARTER   ----- //

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

const Tap = styled.TouchableOpacity`
  width:100%;
  padding: 10px;
  height:100%;
  justify-content:center;
  align-items:center;
`

const QuarterValueText = styled.Text`
  color: white;  
  font-family: Kaxko;
  position: absolute;
  bottom: 10px;
  font-size: 20px;
  opacity: .5;
  ${props => props.position}: 40px;
`

const Chickpea = styled.Image.attrs({
  fadeDuration: 0
})`
  width: 70px;
  resize-mode: contain;
`

// -----   RESET   ----- //

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

// -----   GAME POINTS   ----- //

const GamePointContainer = styled.View`
  background: rgba(0,0,0,.2);
  border: 1px dashed white;
`

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

const GamePointImage = styled.Image`
  width: 25px;
  height: 25px;
  resize-mode:contain;
`

const styles = StyleSheet.create({
  gestureRecognizer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gamePointGestureRecognizer: {
    height: '72%',
    position: 'absolute',
    minWidth: 48, 
    marginVertical: 10,
    zIndex: 4,
  },
  positionLeft: {
    left: 20
  }, 
  positionRight: {
    right: 20
  },
  rotate: {
    transform: [{rotate: '180deg'}]
  },
});