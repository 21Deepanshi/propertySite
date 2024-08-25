// Sodv1201 Group project August 22, 2024 - Deepanshi, Kajal and Kailan 
const fs = require('fs');


async function saveProperty(property, fileName)
{
    const allProperties = await retrieveData(fileName);

    allProperties.push(property);

    fs.writeFileSync(fileName, JSON.stringify(allProperties, null, 2));
    console.log("write file success");

}

function retrieveData(fileName)
{
    return new Promise((res, rej) => {

        fs.readFile(fileName, 'utf8', (error, data) => {

            if(error)
            {
                
                rej(error);
                return;
            }
            else
            {
                
                const dataObject = JSON.parse(data);
                
                res(dataObject);
            }
        })




    });


}





module.exports = { saveProperty, retrieveData };