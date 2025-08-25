import React from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import NormalText from './NormalText';
import TextLabel from './TextLabel';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

type TableRow = Record<string, string | number | null | undefined>;

interface TableProps {
  table: TableRow[] | null | undefined;
}

const MIN_CELL_WIDTH = 80;

const Table: React.FC<TableProps> = ({ table }) => {
  if (!table || table.length === 0) {
    return null;
  }
  const theme = useSelector((state: RootState) => state.theme.isLight);

  const columns = Object.keys(table[0]);
  const numberOfColumns = columns.length;

  const screenWidth = Dimensions.get('window').width;
  const availableWidth = screenWidth - 48;
  const responsiveCellWidth = Math.max(
    MIN_CELL_WIDTH,
    availableWidth / numberOfColumns
  );

  // Header rendering
  const renderHeader = () => (
    <View
      style={[styles.row, theme ? styles.headerRowDark : styles.headerRowLight]}
    >
      {columns.map((col, index) => (
        <View
          style={[
            styles.cell,
            { width: responsiveCellWidth },
            index === columns.length - 1 && { borderRightWidth: 0 },
          ]}
          key={col}
        >
          <TextLabel text={col} />
        </View>
      ))}
    </View>
  );

  // Row rendering
  const renderRow = ({ item }: { item: TableRow }) => (
    <View style={styles.row}>
      {columns.map((col, index) => (
        <View
          style={[
            styles.cell,
            { width: responsiveCellWidth },
            index === columns.length - 1 && { borderRightWidth: 0 },
          ]}
          key={col}
        >
          <NormalText
            text={
              item[col] !== undefined && item[col] !== null
                ? item[col]?.toString()
                : ''
            }
          />
        </View>
      ))}
    </View>
  );

  return (
    <ScrollView horizontal>
      <View>
        {renderHeader()}
        <FlatList
          data={table}
          renderItem={renderRow}
          keyExtractor={(_, index) => index.toString()}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    minHeight: 40,
    alignItems: 'center',
  },
  headerRowLight: {
    backgroundColor: '#f0f0f0',
  },
  headerRowDark: {
    backgroundColor: '#222831',
  },
  cell: {
    borderRightWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 8,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCell: {
    fontWeight: 'bold',
  },
  headerText: {
    fontWeight: 'bold',
    color: '#222',
  },
});

export default Table;
