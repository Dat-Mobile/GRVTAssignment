import React from 'react';
import {StyleSheet, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {randomIntFrom} from '../utils/functions';

const ScreenPlaceHolder = () => {
  return (
    <View style={styles.container}>
      <SkeletonPlaceholder
        speed={1000}
        backgroundColor={'silver'}
        highlightColor={'#E1E9EE'}>
        <View>
          {Array(16)
            .fill(null)
            .map((_, index) => {
              return (
                <View style={styles.row} key={index}>
                  <View>
                    <SkeletonPlaceholder.Item
                      height={14}
                      width={randomIntFrom(40, 55)}
                      marginBottom={4}
                    />
                    <SkeletonPlaceholder.Item
                      height={10}
                      width={randomIntFrom(60, 80)}
                    />
                  </View>
                  <View style={styles.flexEnd}>
                    <SkeletonPlaceholder.Item
                      height={14}
                      width={randomIntFrom(35, 60)}
                      marginBottom={4}
                    />
                    <SkeletonPlaceholder.Item
                      height={10}
                      width={randomIntFrom(40, 85)}
                    />
                  </View>
                </View>
              );
            })}
        </View>
      </SkeletonPlaceholder>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  flexEnd: {alignItems: 'flex-end'},
});

export default React.memo(ScreenPlaceHolder);
