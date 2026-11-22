// components/VideoCard.tsx

import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/styles';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type VideoCardProps = {
  title: string;
  date: string;
  duration: string;
  size: string;
  imageSource: any;
  onPress: () => void;
  onMorePress?: () => void;
};

const VideoCard = ({
  title,
  date,
  duration,
  size,
  imageSource,
  onPress,
  onMorePress,
}: VideoCardProps) => {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.thumbnailContainer}>
        <Image 
          source={imageSource} 
          style={styles.thumbnail}
          resizeMode="cover" 
        />
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{duration}</Text>
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.textContent}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.dateText}>{date}</Text>
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <FontAwesome5 name="file-video" size={12} color={COLORS.grey} style={styles.metaIcon} />
              <Text style={styles.metaText}>{size}</Text>
            </View>
            <View style={styles.metaItem}>
              <FontAwesome5 name="calendar-alt" size={12} color={COLORS.grey} style={styles.metaIcon} />
              <Text style={styles.metaText}>{date}</Text>
            </View>
          </View>
        </View>
        
        {onMorePress && (
          <TouchableOpacity 
            style={styles.moreButton}
            onPress={onMorePress}
            hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <MaterialIcons name="more-vert" size={24} color={COLORS.dark} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius_md,
    marginBottom: SIZES.spacing_md,
    flexDirection: 'row',
    overflow: 'hidden',
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  thumbnailContainer: {
    width: 120,
    height: 90,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: SIZES.radius_xs,
  },
  durationText: {
    color: COLORS.white,
    fontSize: SIZES.xxs,
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
    padding: SIZES.spacing_sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textContent: {
    flex: 1,
    marginRight: SIZES.spacing_sm,
  },
  title: {
    ...FONTS.h4,
    marginBottom: 2,
  },
  dateText: {
    ...FONTS.caption,
    color: COLORS.grey,
    marginBottom: 5,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SIZES.spacing_md,
  },
  metaIcon: {
    marginRight: 4,
  },
  metaText: {
    ...FONTS.caption,
    color: COLORS.grey,
  },
  moreButton: {
    justifyContent: 'center',
    width: 30,
  },
});

export default VideoCard;