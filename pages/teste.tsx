import React, { useRef, useState } from 'react';
import {getApps} from 'firebase/app';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { 
    Firestore, 
    getFirestore,  
    collection, 
    addDoc, 
    getDocs,
    doc,
    deleteDoc,
    setDoc,
} from 'firebase/firestore';
import {email, senha} from '../credentials.json';
import firebaseConfig from '../config.json';


export function Teste() {
    const [isLoading, setIsLoading] = useState(true);
    const [uid, setUid] = useState<String>();
    const [ids, setDocsId] = useState<string[]>([]);
    const [id, setId] = useState<string>();
    const [file, setFile] = useState<string>();
    
    const fileTextAreaRef = useRef<HTMLTextAreaElement>(null);

    
    
    if(!getApps().length){
        initializeApp(firebaseConfig);
    }
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const auth = getAuth();
    function login(email: string, password: string){
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            setIsLoading(false)
            setUid(userCredential.user.uid);
        })
        .catch((error) => {
            console.log(error.code);
            console.log(error.message);
        });    
    }

    async function getDocsData (){
        try{
            let documentIds: string[] = [];
            const {docs} = await getDocs(collection(db, "procedures"))
            console.log(docs);
            docs.map(doc => (
                documentIds.push(doc.id)
            ));
            setDocsId(documentIds);
        } catch (e) {
        console.error("Error adding document: ", e);
        }
    }

    async function deleteDocument (){
        if(!id){
            return
        }
        if(ids.includes(id)){
            
            var ref = doc(db, "procedures", id);
            await deleteDoc(ref)
            .then(()=>{
                alert("Exclusão feita com sucesso!")
                getDocsData();
            })
            .catch((erro) => {
                alert("Ocorreu um erro")
                console.log(erro)
            });
            
        }
    }

    async function createDocument() {
        if(file && id){
            const nameFile = id;
            const newFile = JSON.parse(file);
            var refNewDoc = doc(db, "procedures", nameFile);
            setDoc(refNewDoc, newFile);
        }
        
    }

  return (
        <>
            <div onClick={() => login(email, senha)} >
                Clique em mim
            </div>

            <h1>Welcome to My Awesome App</h1>
            <div id="firebaseui-auth-container"></div>
            {
                isLoading 
                ? <div id="loader">Loading...</div>
                : <div onClick={getDocsData} >
                    Obter     
                    </div>
            }   
            {ids.map(name => {
                return <p>{name}</p>;
            })}
            <input
                // ref={inputIdRef}
                value={id}
                onChange={(value) => setId(value.target.value)}
            />
            <button
                onClick={deleteDocument}
            >Deletar</button><br/>
            <input
                placeholder='Digite o nome do novo documento'
                value={id}
                onChange={(value) => setId(value.target.value)}
            /><br/>
            <textarea
                ref={fileTextAreaRef}
                onChange={(value) => setFile(value.target.value)}
                placeholder='Digite o conteúdo do arquivo'
            /><br/>
            <button
                onClick={createDocument}
            >Criar documento</button>
            {
                
            }
        </>
    );
}