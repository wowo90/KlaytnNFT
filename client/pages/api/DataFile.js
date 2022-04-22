import fs from 'fs'


export async function getStaticProps({ Data }) {

    const read = fs.createReadStream(Data);

    return { props: { read } }
}

export default function CreateReadStreamData(props) 
{
        
    return { read };
}
