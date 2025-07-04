import { StyleSheet, TouchableOpacity, View, Text,FlatList, Animated } from 'react-native';
import React, { useEffect, useState } from 'react';
// import { IconSymbol } from "@/components/ui/IconSymbol";

type Props = {};


const AddPhotosComponents: React.FC<Props> = (props) => {

    const [photosData, setPhotosData] = useState<number[]>([]);
    const[id,setId] = useState(0)
    const [data, setData] = useState([])
   
    const addPhotoHandler=()=>{
      setId(id=>id+1);
      const newData = {id: id  };
      setData( [...data, newData] );
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
