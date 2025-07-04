import { StyleSheet, TouchableOpacity, View, Text,FlatList, Animated } from 'react-native';
import React, { useState } from 'react';
// import { IconSymbol } from "@/components/ui/IconSymbol";

type Props = {};

const AddPhotosComponents: React.FC<Props> = (props) => {

    const [photosData, setPhotosData] = useState<number[]>([]);

    const addButtonHandler=()=>{
        const newVal = photosData.length+1;
        setPhotosData([...photosData, newVal]);
    }

  return (
    <View style={styles.viewContainer}>
            <TouchableOpacity style={styles.addPhotoContainer}>
                <Text style={styles.addPhotoText}>+ Add Photo</Text>
            </TouchableOpacity>
        <View style={styles.fileItem}>
          <Text style={styles.fileText}>filename.jpg</Text>
          <TouchableOpacity>
            <Text>TrashBtn</Text>
            {/* <IconSymbol color="#FF5A5A" size={20} name="paperplane.fill" /> */}
          </TouchableOpacity>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  viewContainer:{
    width:'100%',
    marginVertical:20,
  },
  addPhotoContainer: {
    borderColor: '#E6E7ED',
    borderRadius: 10,
    justifyContent: 'space-around',
    borderWidth: 1,
    marginBottom:10
  },
  addPhotoText: {
    color: '#37B9C5',
    fontWeight: '700',
    padding: 10,
    textAlign:'center'
  },
  fileItem: {
    borderColor: '#FFC618',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom:5

  },
  fileText: {
    color: '#37B9C5',
    fontWeight: '700',
    fontStyle: 'italic',
  },
});

export default AddPhotosComponents;
