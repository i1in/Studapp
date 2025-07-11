
import fetch from 'node-fetch';
const fetchData = async () => {
    const apiUrl = 'http://localhost:5000/feed';
    const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzQ4ODkwMDU1LCJleHAiOjE3NDg5NzY0NTV9.ZldrdG6dwWXL5wwHUduLujTAqGcMxNeKu3YUkftqcXY';

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': token,
            }
        });

        console.log(await response.json())

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.json()}`);
        }

        const data = await response.json();
        console.log('Успешный ответ:', data);
        return data;
    } catch (error) {
        console.error('Ошибка запроса:', error);
        throw error;
    }
};

fetchData();