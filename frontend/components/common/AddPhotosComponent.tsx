import { StyleSheet, TouchableOpacity, View, Text,FlatList, Animated, Dimensions, Alert} from 'react-native';
import React, { useEffect, useState } from 'react';
import PrimaryButton from '../atoms/PrimaryButton';
import Modal from 'react-native-modal';
import * as ImagePicker from 'expo-image-picker';

// import { IconSymbol } from "@/components/ui/IconSymbol";

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

type Props = {};


const AddPhotosComponents: React.FC<Props> = async (props) => {

    const [photosData, setPhotosData] = useState<number[]>([]);
    const[id,setId] = useState(0)
    const [data, setData] = useState([]);
    const [isShowModal, setIsShowModal] = useState(false);
    const [image, setImage] = useState<string | null>(null);

    // const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    // if (status !== 'granted') {
    //   Alert.alert('Permission to access media library is required!');
    //   // return;
    // }
   
    // const addPhotoHandler=()=>{
    //   setId(id=>id+1);
    //   const newData = {id: id  };
    //   setData( [...data, newData] );
    // }

    const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // Enables cropping
      aspect: [4, 3],      // Aspect ratio for cropping
      quality: 1,          // Highest quality
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    } else {
      Alert.alert('No image selected');
    }
  };

    const addPhotoHandler=()=>{
      setIsShowModal(true);
    }

    const deletePhotoHandler=(id:number)=>{
       setData(prevData => prevData.filter(item => item.id !== id));

    }

  return (
    <View style={styles.viewContainer}>
            <TouchableOpacity onPress={addPhotoHandler} style={styles.addPhotoContainer}>
                <Text style={styles.addPhotoText}>+ Add Photo</Text>
            </TouchableOpacity>
        
        {data.map(item => 
           <View key={item.id} style={styles.fileItem}>
              <Text style={styles.fileText}>{item.id}.jpg</Text>
              <TouchableOpacity onPress={()=> deletePhotoHandler(item.id)}>
                <Text style={{}}>X</Text>
              </TouchableOpacity>
         </View>
        ) 
        }

        <Modal
          isVisible={isShowModal}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          onBackdropPress={() => setIsShowModal(false)}
          backdropOpacity={0}
          style={{ justifyContent: 'flex-end', margin: 20, }}
        >
          <View style={{
            height: SCREEN_HEIGHT * 0.2,
            backgroundColor: 'lightblue',
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            alignItems: 'center',
            marginHorizontal: 5,
            justifyContent: 'center',
            zIndex: 2,
          }}>
              <View style={{width:250}}>
                <PrimaryButton isActive={true} submitHandler={()=>{}} title="Click a new Photo" />
                <PrimaryButton isActive={true} submitHandler={pickImage} title="Import from Gallery" />
                <PrimaryButton isActive={true} submitHandler={()=>setIsShowModal(false)} title="Cancel" />
              </View>
          </View>
          
          
        </Modal>
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
