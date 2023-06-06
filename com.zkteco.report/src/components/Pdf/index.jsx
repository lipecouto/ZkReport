import { useState } from 'react';

import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import logo from '../../assets/Logo/_logo.png'
const numColumns = 5; // exemplo de quantidade de colunas selecionadas
const cellWidth = 100 / numColumns; // calcula a largura da célula

// Create styles
const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 35,
     
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '0.5cm',
      padding: '0.5cm',
    },
    logo: {
      width: '4cm',
      height: 'auto',
    },
    title: {
      fontSize: '18pt',
      fontWeight: 'bold',
    },
    datetime: {
      fontSize: '10pt',
    },
    body: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      marginBottom: '1cm',
    },
    cell: {
      width: `${cellWidth}%`,
      padding: '0.0cm',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '10pt',
    },
    tableHeader: {
      backgroundColor: '#EEEEEE',
      fontWeight: 'bold',
      fontSize: '10pt',
    },
    tableRow: {
        fontSize: '10pt',
        borderBottom: '1pt solid #CCCCCC',
    },
    pageNumber: {
      fontSize: '10pt',
      textAlign: 'center',
      marginTop: '1cm',
    },
  });
  

  const generateTableContent = (data) => {
    const tableContent = [];
    let columns;
    if(data){
      // Cria um Set para armazenar as chaves únicas
      const uniqueKeys = new Set();

      // Itera sobre cada objeto do array e adiciona as chaves ao Set
      data[0].forEach((item) => {
        Object.keys(item).forEach((key) => {
          if(key !== 'id'){
            uniqueKeys.add(key);  
          }
          
        });
      });

      // Converte o Set de chaves para um array      
      columns = Array.from(uniqueKeys);

    }

    columns.forEach((el, index) => {
      const columnContent = (
        <View style={styles.cell} key={index}>
          <Text style={styles.tableHeader} key={el + index}>{el}</Text>
          {data[0].map((item, rowIndex) => 
          { console.log(typeof item[el])
            return (
            <View style={styles.tableRow} key={rowIndex} wrap={false}>
              <Text wrap>{item[el].length === 0 ? '-' : item[el]}</Text>
            </View>
            )
          }
          )}
        </View>
      );
       
      tableContent.push(columnContent);
    });
  
    return tableContent;
  };

  // Componente do relatório
  const PdfPage = ({ data }) => {
    let tableContent;
    if(data){
      tableContent = generateTableContent(data);
    }
    
    return (
      <Document>
        <Page size="A4" orientation="landscape" style={styles.page}>
          {/* Cabeçalho */}
          <View style={styles.header}>
            <Image src={logo} style={styles.logo} />
            <Text style={styles.title}>Relatório formatado</Text>
            <Text style={styles.datetime}>{new Date().toLocaleString()}</Text>
          </View>
          
          {/* Corpo do relatório */}
          <View style={styles.body}>
            {/* Tabela */}
             {tableContent}
          </View>
  
        {/* Rodapé */}
        <View>
          <View style={{ borderBottom: '1pt solid #CCCCCC' }} />
          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} fixed />
        </View>
      </Page>
    </Document>
  )}
  
  


export default PdfPage