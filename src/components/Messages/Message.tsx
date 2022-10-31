import React, { useEffect, useRef, useState } from "react";

import {
  Animated,
  Button,
  Dimensions,
  Image,
  Platform,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  View,
  PanResponder,
  Modal,
  StyleSheet,
} from "react-native";

import Box from "../shared/Box";
import { MediaType } from "../../types";
import Text from "../shared/Text";
import Media from "../shared/Media";

const { width, height } = Dimensions.get("screen");

type MessageProps = {
  message: {
    text: string;
    media: MediaType[];
    timestamp: string;
  };
  self: boolean;
};

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const Message: React.FC<MessageProps> = ({ message, self }) => {
  const [layoutData, setData] = useState(null);
  const [currentMedia, setCurrentMedia] = useState(null);

  return (
    <Box margin={"m"} alignSelf={self ? "flex-end" : "flex-start"}>
      <Box
        backgroundColor={self ? "messageOutBG" : "messageInBg"}
        borderRadius={5}
        maxWidth={200}
        padding={"m"}
      >
        {message?.media.length === 0 ? null : message?.media.length <= 1 ? (
          <Media
            toggleModal={(data: any) => setData(data)}
            setCurrentMedia={setCurrentMedia}
            media={message.media[0]}
          />
        ) : (
          <Box flexGrow={1} flexDirection={"row"} flexWrap={"wrap"}>
            {message.media?.map((item, index) => (
              <Media
                toggleModal={(data: any) => setData(data)}
                setCurrentMedia={setCurrentMedia}
                key={`media_no-${index}`}
                media={item}
              />
            ))}
          </Box>
        )}
        <Text variant={"body2"}>{message.text}</Text>
      </Box>
      <Box position={"relative"} top={0} left={15}>
        <Text fontSize={8} variant={"caption"}>
          {message.timestamp}
        </Text>
      </Box>
      {layoutData !== null && (
        <ModalView
          layoutData={layoutData}
          currentMedia={currentMedia}
          close={() => {
            setData(null);
            setCurrentMedia(null);
          }}
        />
      )}
    </Box>
  );
};

function ModalView({ layoutData, close, currentMedia }) {
  const { x, y, _width, _height } = layoutData;
  const animtion = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const [expanded, setExpanded] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      LayoutAnimation.easeInEaseOut();
      setExpanded(true);
    }, 10);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsPopupVisible(false);
    }, 2000);
  }, []);
  const onRequestClose = () => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        150,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.opacity
      ),
      () => {
        close();
      }
    );
    setExpanded(false);
  };
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {},
      onPanResponderMove: Animated.event([null, { dy: animtion.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, g) => {
        if (Math.abs(g.vy) > 2) {
          reset(true, g.vy > 0);
          return;
        }
        reset();
      },
      onPanResponderTerminate: () => {
        reset();
      },
    })
  ).current;
  const reset = (closeModal, down) => {
    Animated.spring(animtion, {
      toValue: { x: 0, y: closeModal ? height * (down ? 1 : -1) : 0 },
      bounciness: 0,
      useNativeDriver: true,
    }).start();
    if (closeModal) {
      setTimeout(() => {
        close();
      }, 200);
    }
  };
  return (
    <Modal visible onRequestClose={onRequestClose} transparent>
      <View style={[styles.center]} {...panResponder.panHandlers}>
        {expanded && (
          <Animated.View
            style={[StyleSheet.absoluteFill, { backgroundColor: "#000000aa" }]}
          />
        )}
        <Animated.View
          style={[
            expanded
              ? {
                  height: "100%",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }
              : {
                  height: _height,
                  width: _width,
                  left: x,
                  top: y,
                  position: "absolute",
                },
            {
              backgroundColor: "#000",
              overflow: "hidden",
              transform: animtion.getTranslateTransform(),
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <Media single={true} media={currentMedia} expanded={true} />
          {expanded && (
            <View style={styles.close}>
              <Button title="Fermer" onPress={onRequestClose} />
            </View>
          )}
          {isPopupVisible && (
            <Text
              style={[
                styles.label,
                {
                  textAlign: "center",
                  position: "absolute",
                  bottom: height / 6,
                },
              ]}
            >
              Glisser vers le haut ou le bas pour fermer
            </Text>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  item: {
    height: width / 2,
    flex: 1,
    padding: 3,
  },
  close: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  fill: {
    height: "100%",
    width: "100%",
    position: "absolute",
  },
  label: {
    color: "#fff",
    fontSize: 20,
    marginTop: 100,
  },
});
export default Message;
