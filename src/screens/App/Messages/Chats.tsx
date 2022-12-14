import { Box, MessageHeader, Message, ReplyField } from "../../../components";
import React from "react";
import HeaderMsg from "../../../data/headerMsg";
import { singleMessage, singleMessageWithMedia } from "../../../data/message";
import { ScrollView } from "react-native";

const Chats = ({ navigation }) => {
  return (
    <Box flex={1} mt={"xl"} style={{ paddingBottom: 60 }}>
      <MessageHeader
        onGoBack={() => navigation.goBack()}
        onMenuPress={() => {}}
        user={HeaderMsg}
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Message self={false} message={singleMessage} />
        <Message self={true} message={singleMessage} />
        <Message self={false} message={singleMessageWithMedia} />
        <Message self={false} message={singleMessageWithMedia} />
        <Message self={true} message={singleMessage} />
        <Message self={true} message={singleMessageWithMedia} />
      </ScrollView>
      <Box position={'absolute'}  bottom={0} width={'100%'} flex={1} >

      <ReplyField placeholder="Votre Message..."   />
      </Box>
   
    </Box>
  );
};

export default Chats;
