import { View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

const HeaderLeft = () => {
  return (
    <Link href={"/"} asChild>
      <TouchableOpacity>
        <AntDesign name="home" size={36} color="#002147" />
      </TouchableOpacity>
    </Link>
  );
};

export default HeaderLeft;
