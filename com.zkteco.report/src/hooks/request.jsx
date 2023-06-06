import { useState } from 'react';
import axios from 'axios';

function useRequest() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const makeRequest = async (params) => {
    let config = {
        method: params.method,
        maxBodyLength: Infinity,
        url: params.url.url,
        headers: { 
            'Acess-Control-Allow-Origin' : '*',
            'Content-Type': 'application/json'            
        },
        data : params.data
        };
                
    try {

        const response = await axios.request(config);
        
        if ('result' in response) {
        
        const result = response['result'];
            if (result !== 'OK') {
            setData(response.data);
            throw new Error('Erro na requisição');
            }
        }

        setData(response.data);
        setLoading(false);
        return response.data;
        } catch (error) {
            setLoading(false);
            setError(error);
        throw error;
        }
    };
  
    return { data, error, loading, makeRequest };
}

export default useRequest;