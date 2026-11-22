// components/FileInput.tsx

import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/styles';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

type Props = {
  handleSetIsSelected: (filename?: string) => void;
};

const FileInput: React.FC<Props> = ({ handleSetIsSelected }) => {
  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["video/*"],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        console.log("Selected file:", file.name, file.mimeType, file.uri);
        handleSetIsSelected(file.name); // Pass the filename to the parent component
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleFilePick}
      style={styles.button}
    >
      <FontAwesome5 name="video" size={16} color={COLORS.primary} style={styles.icon} />
      <Text style={styles.buttonText}>Select Video</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.white,
    paddingVertical: SIZES.spacing_sm,
    paddingHorizontal: SIZES.spacing_lg,
    borderRadius: SIZES.radius_sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  icon: {
    marginRight: SIZES.spacing_sm,
  },
  buttonText: {
    ...FONTS.button,
    color: COLORS.primary,
    fontWeight: 'bold',
  }
});

export default FileInput;