import styled from "styled-components/native";
const woodTexture = require('../assets/textures/wood.jpg');

const ResetModal = ({modalVisible, setModalVisible, setScore, setGameScore}) => {
  
  if (!modalVisible) return;

  return (
    <ModalBackground>
      <ModalView>
        <ModalBackgroundImage source={woodTexture} resizeMode="repeat">

          <ModalText fontSize={26}>BERREZARRI</ModalText>

          <ModalText fontSize={20}>Berrezarri tantoak</ModalText>

          <Row>
            <ModalButton 
              onPress={() => {setScore([0, 0])}}
              title={'PUNTUAK'}
            />

            <ModalButton 
              onPress={() => {setGameScore([0, 0])}}
              title={'USTELAK'}
            />
          </Row>

          <ModalButton 
            onPress={() => {setModalVisible(false)}}
            title={'ITXI'}
          />

        </ModalBackgroundImage>
      </ModalView> 
    </ModalBackground>
  )
}

const SettingsModal = ({modalVisible, setModalVisible, maxScore, setMaxScore}) => {

  if (!modalVisible) return;

  return (
    <ModalBackground>
      <ModalView>
        <ModalBackgroundImage source={woodTexture} resizeMode="repeat">

          <ModalText fontSize={26}>EZARPENAK</ModalText>

          <ModalText fontSize={20}>Joko-tantoak</ModalText>

          <Row>
            <ModalButton 
              onPress={() => {
                setMaxScore(20);
              }}
              title={'20'}
              active={maxScore === 20}
            />

            <ModalButton 
              onPress={() => {setMaxScore(30)}}
              title={'30'}
              active={maxScore === 30}
            />
            <ModalButton 
              onPress={() => {setMaxScore(40)}}
              title={'40'}
              active={maxScore === 40}
            />
          </Row>

          <ModalButton 
            onPress={() => {setModalVisible(false)}}
            title={'ITXI'}
          />

        </ModalBackgroundImage>
      </ModalView> 
    </ModalBackground>
  )

}

const ModalButton = ({onPress, title, active = false}) => {
  
  const VascanTexts = ['ITXI'];
  const fontFamily = VascanTexts.includes(title) ? 'Vascan' : 'Kaxko';

  return (
    <Button onPress={onPress} active={active}>
      <ButtonText style={{fontFamily}}>{title}</ButtonText>
    </Button>
  );
}

const Row = styled.View`
  flex-direction: row;
`

const Button = styled.TouchableOpacity`
  border: 1px solid black;
  padding: 10px 15px;
  background: ${props => props.active ? 'rgba(46, 29, 0, .65)' : 'rgba(0, 0, 0, .2)'};
  margin: 5px 20px;
  border-radius: 3px;
`

const ButtonText = styled.Text`
  font-size: 20px;
  text-align:center;
  color: black;
`

const ModalText = styled.Text`
  font-size: ${props => props.fontSize}px;
  font-family: Kaxko;
  text-align:center;
  margin-top: 10px;
`

const ModalBackgroundImage = styled.ImageBackground`
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 20px;
`

const ModalView = styled.View`
  width: 40%;
  background: #666666;
  flex-direction: column;
  transform: rotate(90deg);
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  gap: 5px;
  justify-content: center;
  align-items: center;
`
  
const ModalBackground = styled.View`
  width: 100%;
  height: 100%;
  z-index: 999;
  background: rgba(0,0,0,0.5);
  justify-content: center;
  align-items: center;
`

export { ResetModal, SettingsModal };
