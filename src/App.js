import React from 'react';
import { Button, Input, makeStyles } from '@material-ui/core';
import { useEffect, useState } from 'react';
import './App.css';
import { auth, db } from './firebase';
import Post from './Post';
import Modal from '@material-ui/core/Modal';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';



function getModalStyle() {
    const top = 50
    const left = 50
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  
  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
}));


const App = () => {
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);

    const [posts, setPosts] = useState([])
    const [openSignIn, setOpenSignIn] = useState(false)
    const [open, setOpen] = useState(false)
    const [openUpload, setOpenUpload] = useState(false)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)

    useEffect(() => {
        db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
            setPosts(snapshot.docs.map(doc => ({
                id: doc.id, post: doc.data()
            })))
        })
    },[])   

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                console.log(authUser);
                setUser(authUser)

                if (authUser.displayName) {
                    
                } else {
                    return authUser.updateProfile({
                        displayName: username
                    })
                }

            } else {
                setUser(null)
            }
        })

        return () => {
            unsubscribe()
        }
    }, [user, username])

    const signUp = (e) => {
        e.preventDefault()

        auth
          .createUserWithEmailAndPassword(email, password)
          .then((authUser) => {
            return authUser.user.updateProfile({
              displayName: username,
            });
          })
          .catch((error) => alert(error.message));

        setOpen(false)
    }

    const signIn = (e) => {
        e.preventDefault()

        auth
          .signInWithEmailAndPassword(email, password)
          .catch((error) => alert(error.message));

        setOpenSignIn(false)
    }

    return (
        <div className="app">            
            
            <Modal
                open={openSignIn}
                onClose={() => setOpenSignIn(false)}
            >
                <div style={modalStyle} className={classes.paper}>
                    <form className="app_signUp">
                        <center>
                            <img className="app__headerLogo" src="https://logos-download.com/wp-content/uploads/2016/03/Instagram_logo_black.png" alt=""
                            />                
                        </center>
                        <Input 
                            placeholder="Email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input 
                            type="password" 
                            placeholder="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />    
                        <Button type="submit" onClick={signIn}>Sign in</Button>
                    </form>                    
                </div>
            </Modal>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
            >
                <div style={modalStyle} className={classes.paper}>
                    <form className="app_signUp">
                        <center>
                            <img className="app__headerLogo" src="https://logos-download.com/wp-content/uploads/2016/03/Instagram_logo_black.png" alt=""
                            />                
                        </center>
                        <Input 
                            placeholder="Username" value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <Input 
                            placeholder="Email" value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input 
                            type="password" 
                            placeholder="password" value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />    
                        <Button type="submit" onClick={signUp}>Sign up</Button>
                    </form>                    
                </div>
            </Modal>  
            <Modal
                open={openUpload}
                onClose={() => setOpenUpload(false)}
            >
                <div style={modalStyle} className={classes.paper}>
                    <form className="app_signUp">                        
                        <center>
                            <img className="app__headerLogo" src="https://logos-download.com/wp-content/uploads/2016/03/Instagram_logo_black.png" alt=""
                            />                
                        </center>
                        {user?.displayName 
                            ? <ImageUpload openUpload={openUpload} username={user.displayName} />
                            : <h3>Sorry,you need to login to upload</h3>
                        } 
                    </form>                    
                </div>
            </Modal>      

            <div className="app__headerContainer">
                <div className="app__header">
                    <img className="app__headerLogo" src="https://logos-download.com/wp-content/uploads/2016/03/Instagram_logo_black.png" alt=""/>
                    {user 
                    ? (<div className="app__logoutContainer">
                        <Button onClick={() => auth.signOut()}>Logout</Button>
                        <Button onClick={() => setOpenUpload(true)}>Upload</Button>
                    </div>)
                    : (<div className="app__loginContainer">
                        <Button onClick={() => setOpen(true)}>Sign up</Button>
                        <Button onClick={() => setOpenSignIn(true)}>Sign in</Button>
                    </div>) 
                    } 
                </div>
            </div>

                        
            
            <div className="app__content">
                <div className="app__content-posts">
                    {
                        posts.map(({id, post}) =>
                            <Post 
                                key={id}
                                postId={id}
                                user={user}
                                profileSrc={post.profileSrc} 
                                username={post.username}
                                imageUrl={post.imageUrl}
                                caption={post.caption}
                            />
                        )
                    }  
                </div>
                              
                
            </div>   
            <div className="app__upload">
                {user?.displayName 
                    ? <ImageUpload username={user.displayName} /> 
                    : <h3>Sorry,you need to login to upload</h3>
                }  
            </div> 

            <InstagramEmbed
                url='https://www.instagram.com/p/CNmk87bA8WE/'
                maxWidth={320}
                hideCaption={false}
                containerTagName='div'
                protocol=''
                injectScript
                onLoading={() => {}}
                onSuccess={() => {}}
                onAfterRender={() => {}}
                onFailure={() => {}}
            />
            
            
        </div>
    );
}

export default App;
