const express = require('express')
const router = express.Router()
var { check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken')
const {User} = require('../models/user')
const {Places} = require('../models/places')
const {Comments} = require('../models/comments')
const mongoose = require('mongoose')
const multer = require('multer');
const nodemailer = require("nodemailer");

const storageUserImg = multer.diskStorage({
    destination: function(req, file, cb)
    {
        cb(null,'./uploads/')
    },
    filename: function(req, file, cb)
    {
        cb(null,new Date().toISOString() + file.originalname)
    }
})

const fileFilter = (req, file ,cb) => 
{
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'|| file.mimetype === 'image/jpg')
    {
        cb(null, true)
    }
    else
    {
        cb(null, false)
    }
}

const uploadUsersImg = multer({ 
    storage: storageUserImg,
    limits: {
    fileSize: 1024 * 1024 * 5
    },
    fileFilter : fileFilter
});

mongoose.Promise = global.Promise

//const URI = "mongodb+srv://khaled:379200123@cluster0.ttow3.mongodb.net/VisitEgypt?retryWrites=true&w=majority";
const URI = "mongodb+srv://khaled:379200123@cluster0.opraibf.mongodb.net/?retryWrites=true&w=majority";


mongoose
    .connect( URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log( 'Database Connected' ))
    .catch(err => console.log( err ));


let authenticate = (req,res,next) => {
  let token = req.header('x-access-token');
  if(token)
  {
    jwt.verify(token,User.getJWTSecret(), (err,decoded) =>{
        if(err)
        {
            res.status(401).send(err)
        }
        else
        {
            req.user_id = decoded._id
            next();
        }
    })
  }
}

let verifySession = (req, res, next) => {
  let refreshToken = req.header('x-refresh-token');
  let _id = req.header('_id');

  User.findByIdAndToken(_id, refreshToken).then((user) => {
      if (!user) {
          return Promise.reject({
              'error': 'User not found. Make sure that the refresh token and user id are correct'
          });
      }

      req.user_id = user._id;
      req.userObject = user;
      req.refreshToken = refreshToken;

      let isSessionValid = false;

      user.sessions.forEach((session) => {
          if (session.token === refreshToken) {
              if (User.hasRefreshTokenExpired(session.expiresAt) === false) {
                  isSessionValid = true;
              }
          }
      });

      if (isSessionValid) {
          next();
      } else {
          return Promise.reject({
              'error': 'Refresh token has expired or the session is invalid'
          })
      }

  }).catch((e) => {
      res.status(401).send(e);
  })
}

router.post('/register', check('username','Only Alphabets Allowed').isAlpha(),
      check('username', 'Invlalid Username').exists().trim().escape().custom(userName=> {
            return new Promise((resolve, reject) => {
                User.findOne({ username: userName } )
                .then(usernameExist => {
                    if(usernameExist !== null){
                        reject(new Error("Username already exists."))
                    }else{
                        resolve(true)
                    }
                })
                
            })
      }), 
      check('email', 'Invalid email').exists().isEmail().trim().escape().custom(userEmail=> {
        return new Promise((resolve, reject) => {
            User.findOne({ email: userEmail } )
            .then(emailExist => {
                if(emailExist !== null){
                    reject(new Error("Email already exists."))
                }else{
                    resolve(true)
                }
            })
            
        })
    }), 
      check('password', 'The password must be at least 8 numbers long and contain a char')
      .not()
      .isIn(['123', 'password', 'god'])
      .withMessage('Do not use a common word as the password')
      .isLength({ min: 8 })
      .matches(/\d/),
      check(
        'confirmpassword',
        'Passwords do not match',
      ) .exists().custom((value, { req }) => value === req.body.password),
 (req,resp) => {

    delete req.body.confirmpassword;
    let date_ob = new Date();
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let date = ("0" + date_ob.getDate()).slice(-2);
    let year = date_ob.getFullYear();
    req.body.joinedDate = months[month-1] + ' ' + date + ', ' + year;
    req.body.imageURL = "https://fertilitynetworkuk.org/wp-content/uploads/2017/01/Facebook-no-profile-picture-icon-620x389.jpg";
    userData = req.body
    const result = validationResult(req);
    if(!result.isEmpty()) {
    if(result.array()[0]['msg'] == "Email already exists."){
      return resp.status(405).json({status: false,
        error: "This Email is Already in Use",
        errorType: "email",
        user: null});
    }
    if(result.array()[0]['msg'] == "Username already exists."){
        return resp.status(405).json({status: false,
          error: "Username already exists",
          errorType: "username",
          user: null});
      }
    return resp.status(401).json({status: false,
      error: "",
      user: null});
    }
  else{  
    let user = new User(userData)
    user.save().then(() => {
        return user.createSession();
    }).then((refreshToken) => {
        return user.generateAccessAuthToken().then((accessToken) => {
            return { accessToken, refreshToken }
        });
    }).then((authTokens) => {
        resp
                .header('x-refresh-token', authTokens.refreshToken)
                .header('x-access-token', authTokens.accessToken)
            .send(user);
    }).catch((e) => {
        resp.status(400).send(e);
    })
  }
})

router.post('/login', (req, res) => {
    
    let email = req.body.email;
    let password = req.body.password;

    User.findByCredentials(email, password).then((user) => {
        return user.createSession().then((refreshToken) => {
            return user.generateAccessAuthToken().then((accessToken) => {
                return { accessToken, refreshToken }
            });
        }).then((authTokens) => {
            res
                .header('x-refresh-token', authTokens.refreshToken)
                .header('x-access-token', authTokens.accessToken)
                .send(user);
        })
    }).catch((e) => {
        res.status(400).send(e);
    });
})

router.get('/user', authenticate, (req,res) => {
    User.find({
        _id : req.user_id
    }).then((userData) =>{
        res.send(userData);
    }).catch((e) =>{
        res.send(e)
    })
})
     
router.patch('/uploadImgUser', authenticate, uploadUsersImg.single('imgFile') , (req,res) => {
    User.findOneAndUpdate({ _id : req.user_id}, {
        imageURL : req.file.path
    }).then(() => {
        res.send({ 'message' : 'Image has been uploaded Successfully'})
    })
})

router.patch('/updateUser', authenticate, (req,res) => {
    User.findOneAndUpdate({ _id : req.user_id}, {
        $set : req.body
    }).then(() => {
        res.send({ 'message' : 'User has been Updated Successfully'})
    })
})

router.patch('/changePassword', authenticate, (req,res) => {
    User.find({
        _id : req.user_id
    }).then((userData) =>{
        if (req.body.password === '')
        {
            res.status(400).json({status: false,
                error: "Enter a password.",
                errorType: "nullPassword",
                user: null});
        }
        else if(userData[0]['password'] === req.body.password)
        {
            res.status(400).json({status: false,
                error: "Same password as old password has been entered.",
                errorType: "sameOldpassword",
                user: null});
        }
        else
        {
            User.findOneAndUpdate({ _id : req.user_id}, {
                $set : req.body
            }).then(() => {
                res.send({ 'message' : 'Password has been Updated Successfully'})
            })
        }
    })
})

router.post('/oldPassword', authenticate, (req, res) => {
    User.findByCredentials(req.body.email, req.body.pass).then((user) => {
        res.send(user)
    }).catch((e) => {
        res.status(400).send(e);
    });
})

router.post('/places', authenticate, (req,res) =>{
    let imageURL;
    if(req.body.title == 'Pyramids')
    {
        imageURL = "placesPics/pyramidsPlace.jpeg"
    }
    else if(req.body.title == 'Al-Azhar')
    {
        imageURL = "placesPics/azhar.jpeg"
    }
    else if(req.body.title == 'Citadel')
    {
        imageURL = "placesPics/citadel.webp"
    }
    else if(req.body.title == 'Egyptian Museum')
    {
        imageURL = "placesPics/museum.jpeg"
    }
    else if(req.body.title == 'Saqqara')
    {
        imageURL = "placesPics/saqqara.jpeg"
    }
    else if(req.body.title == 'Khan El-Khalili')
    {
        imageURL = "placesPics/khan.jpeg"
    }
    else if(req.body.title == 'Bibliotheca Alexandria')
    {
        imageURL = "placesPics/library.jpeg"
    }
    else if(req.body.title == 'Fort Qaitbey')
    {
        imageURL = "placesPics/FortQaitbey .jpeg"
    }
    else if(req.body.title == 'Explore the Desert by Jeep or Quad Bike')
    {
        imageURL = "placesPics/quadBike.jpeg"
    }
    else if(req.body.title == 'Straits of Gubal')
    {
        imageURL = "placesPics/gubal.jpeg"
    }
    else if(req.body.title == 'Giftun Islands')
    {
        imageURL = "placesPics/giftun.jpeg"
    }
    else if(req.body.title == 'Thistlegorm Wreck')
    {
        imageURL = "placesPics/shipwreck.jpeg"
    }
    else if(req.body.title == "Saint Catherine's Monastery")
    {
        imageURL = "placesPics/saint.jpeg"
    }
    else if(req.body.title == 'Hot Air Balloon Ride over Luxor at Sunrise')
    {
        imageURL = "placesPics/balloon.jpeg"
    }
    else if(req.body.title == 'Temple of Karnak')
    {
        imageURL = "placesPics/karnak.jpeg"
    }
    else if(req.body.title == 'El Gouna')
    {
        imageURL = "placesPics/elGouna.jpeg"
    }
    else if(req.body.title == 'Dahab Lagoon')
    {
        imageURL = "placesPics/dahab.jpeg"
    }
    else if(req.body.title == "Temple Of Deir Al-Bahri (Queen Hatshepsut's Temple)")
    {
        imageURL = "placesPics/hatshepsut'stemple.jpeg"
    }
    else if(req.body.title == 'Thonis City')
    {
        imageURL = "placesPics/thonis.jpeg"
    }
    else if(req.body.title == 'Thebes City')
    {
        imageURL = "placesPics/thebes.jpeg"
    }
    else if(req.body.title == 'Abydos City')
    {
        imageURL = "placesPics/abydos.jpeg"
    }
    else if(req.body.title == 'Medinet Habu')
    {
        imageURL = "placesPics/habu.jpeg"
    }
    let newPlace = new Places({
        title : req.body.title,
        imageURL : imageURL,
        _city : req.body.city,
        _userId : req.user_id
    })
    newPlace.save().then((newPlaceDoc) =>{
        res.send(newPlaceDoc)
    })
})

router.post('/placesForTesting', (req,res) => {
            let imageURL;
            if(req.body.title == 'Pyramids')
            {
                imageURL = "placesPics/pyramidsPlace.jpeg"
            }
            else if(req.body.title == 'Al-Azhar')
            {
                imageURL = "placesPics/azhar.jpeg"
            }
            else if(req.body.title == 'Citadel')
            {
                imageURL = "placesPics/citadel.webp"
            }
            else if(req.body.title == 'Egyptian Museum')
            {
                imageURL = "placesPics/museum.jpeg"
            }
            else if(req.body.title == 'Saqqara')
            {
                imageURL = "placesPics/saqqara.jpeg"
            }
            else if(req.body.title == 'Khan El-Khalili')
            {
                imageURL = "placesPics/khan.jpeg"
            }
            else if(req.body.title == 'Bibliotheca Alexandria')
            {
                imageURL = "placesPics/library.jpeg"
            }
            else if(req.body.title == 'Fort Qaitbey')
            {
                imageURL = "placesPics/FortQaitbey .jpeg"
            }
            else if(req.body.title == 'Giftun Islands')
            {
                imageURL = "placesPics/giftun.jpeg"
            }
            else if(req.body.title == 'Dahab Lagoon')
            {
                imageURL = "placesPics/dahab.jpeg"
            }
            else if(req.body.title == "Temple Of Deir Al-Bahri (Queen Hatshepsut's Temple)")
            {
                imageURL = "placesPics/hatshepsut'stemple.jpeg"
            }

            let newPlace = new Places({
                title : req.body.title,
                imageURL : imageURL,
                _city : req.body.city,
                _userId : req.body.user_id
            })
            newPlace.save().then((newPlaceDoc) =>{
                res.send(newPlaceDoc)
            })
})

router.post('/checkAddPlaceStatus', authenticate, (req,res) =>{
    Places.find({
        title : req.body.title,
        _userId : req.user_id
    }).then((placeData) =>{
         res.send(placeData);
    })
})

router.post('/getPlaceDetails', (req,res) =>{
    if(req.body.place === 'pyramids')
    {
        res.json(pyrmaids)
    }
    else if (req.body.place === 'egyptianMuseum' || req.body.place === 'egyptian%20museum')
    {
        res.json(egyptianMuseum)
    }
    else if (req.body.place === 'al-azhar')
    {
        res.json(alAzhar)
    }
    else if (req.body.place === 'saqqara')
    {
        res.json(saqqara)
    }
    else if (req.body.place === 'khan-El-Khalili' || req.body.place === 'khan%20el-khalili')
    {
        res.json(khan)
    }
    else if (req.body.place === 'bibliothecaAlexandria' || req.body.place ===  'bibliotheca%20alexandria')
    {
        res.json(library)
    }
    else if (req.body.place === 'citadel')
    {
        res.json(citadel)
    }
    else if (req.body.place === 'tanis')
    {
        res.json(tanis)
    }
    else if (req.body.place === 'medinetHabu' || req.body.place === 'medinet%20habu')
    {
        res.json(medinetHabu)
    }
    else if (req.body.place === 'templeOfKarnak' || req.body.place === 'temple%20of%20karnak')
    {
        res.json(templeOfKarnak)
    }
    else if (req.body.place === 'fortQaitbey' || req.body.place ===  'fort%20qaitbey')
    {
        res.json(qaitbey)
    } 
    else if (req.body.place === 'straitsOfGubal' || req.body.place === 'straits%20of%20gubal')
    {
        res.json(gubal)
    }
    else if (req.body.place === 'giftunIsland' || req.body.place === 'giftun%20islands')
    {
        res.json(giftun)
    }
    else if (req.body.place === 'thistlegormWreck' || req.body.place === 'thistlegorm%20wreck')
    {
        res.json(thistlegorm)
    }
    else if (req.body.place === 'thebesCity' || req.body.place === 'thebes%20city')
    {
        res.json(thebes)
    }
    else if (req.body.place === 'el-Gouna' || req.body.place === 'el%20gouna')
    {
        res.json(elGouna)
    }
})

router.get('/getChosenPlacesUrl', authenticate, (req,res) => {
    Places.find({
        _userId : req.user_id
    }).then((places) =>{
        res.send(places);
    }).catch((e) =>{
        res.send(e)
    })
})

router.get('/getCommentsUrl', (req,res) => {
    Comments.find().sort('-time').exec(function(err, collectionItems) {
        collectionItems.forEach(function (col) {
            Comments.findOneAndUpdate({ _id : col._id}, {
                $set : {"timeNow" : timeSince(col.time)}
            }).then(() => {
                
            })
        })
        Comments.find().sort('-time').exec(function(err, comments) {
            res.send(comments)
        })
    })
})

router.post('/getCityPlacesForExperienceUrl', (req,res) => {
    if(req.body.city == "cairo")
    {
        res.send(CairoPlaces);
    }
    else if(req.body.city == "alex")
    {
        res.send(Alexplaces);
    }
    else if(req.body.city == "hurghada")
    {
        res.send(HurghadaPlaces);
    }
    else if(req.body.city == "sharm")
    {
        res.send(SharmPlaces);
    }
    else if(req.body.city == "luxor")
    {
        res.send(LuxorPlaces);
    }
    else if(req.body.city == "ancient")
    {
        res.send(AncientPlaces);
    }
    else if(req.body.city == "beaches")
    {
        res.send(Beaches);
    }
})

router.post('/getCityCommentsUrl', (req,res) => {
    Comments.find({
        city: req.body.city
    }).sort('-time').exec(function(err, collectionItems) {
        collectionItems.forEach(function (col) {
            Comments.findOneAndUpdate({ _id : col._id}, {
                $set : {"timeNow" : timeSince(col.time)}
            }).then(() => {
                
            })
        })
        Comments.find({
            city: req.body.city
        }).sort('-time').exec(function(err, comments) {
            res.send(comments)
        })
    })
})

function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);
  
    var interval = seconds / 31536000;
  
    if (interval > 1) {
      return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        if(Math.floor(interval) == 1)
        {
            return Math.floor(interval) + " day ago";
        }
      return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        if(Math.floor(interval) == 1)
        {
            return Math.floor(interval) + " hour ago";
        }
      return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
        if(Math.floor(interval) == 1)
        {
            return Math.floor(interval) + " minute ago";
        }
      return Math.floor(interval) + " minutes ago";
    }
    if(seconds == 0)
    {
        return "Just now";
    }

    return " about a minute ago";
  }

router.post('/addCommentUrl', authenticate, (req,res) => {

    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    time = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds

    let username, imageURL

    User.find({
        _id : req.user_id
    }).then((userData) =>{
        username = userData[0].username
        if(userData[0].imageURL[0] == "h")
        {
            imageURL =  userData[0].imageURL
        }
        else
        {
            imageURL =  "http://localhost:3000/" + userData[0].imageURL
        }

        let newComment = new Comments({
            city : req.body.city,
            place : req.body.place,
            comment : req.body.comment,
            time : date_ob,
            likes : 0,
            _userId : req.user_id,
            username : username,
            imageURL : imageURL
        })
    
        newComment.save().then((newCommentDoc) =>{
            res.send(newCommentDoc)
        })

    }).catch((e) =>{
        res.send(e)
    })
})


router.patch('/likeUnlikeCommentUrl', authenticate, (req,res) => {
    like = 0
    if(req.body.likeUnLike == 'like')
    {
        Comments.find({
            _id : req.body.comment._id
        }).then((comment) =>{
            like = comment[0].likes + 1
            Comments.findOneAndUpdate({ _id : req.body.comment._id}, {
                likes : like
            }).then((likes) => {
                res.send({ 'message' : 'Comment has been Updated Successfully'})
            })
        })
    }
    else if(req.body.likeUnLike == 'unLike')
    {
        Comments.find({
            _id : req.body.comment._id
        }).then((comment) =>{
            like = comment[0].likes - 1
            Comments.findOneAndUpdate({ _id : req.body.comment._id}, {
                likes : like,
                unLikedUsers : req.user_id
            }).then(() => {
                res.send({ 'message' : 'Comment has been Updated Successfully'})
            })
        })
    }
})

router.post('/signInWithGoogleUrl', (req,res) => {
    User.find({
        email : req.body.email
    }).then((foundUser) =>{
        if(foundUser.length > 0)
        {
            User.findByEmail(req.body.email).then((user) => {
                return user.createSession().then((refreshToken) => {
                    return user.generateAccessAuthToken().then((accessToken) => {
                        return { accessToken, refreshToken }
                    });
                }).then((authTokens) => {
                    user.accessToken = authTokens.accessToken
                    user.refreshToken = authTokens.refreshToken
                    res.send(user);
                })
            }).catch((e) => {
                res.status(400).send(e);
            });
        }
        else
        {
            let date_ob = new Date();
            let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            let date = ("0" + date_ob.getDate()).slice(-2);
            let year = date_ob.getFullYear();
            req.body.joinedDate = months[month-1] + ' ' + date + ', ' + year;
            userData = req.body
            let user = new User(userData)
            user.save().then(() => {
                return user.createSession();
            }).then((refreshToken) => {
                return user.generateAccessAuthToken().then((accessToken) => {
                    return { accessToken, refreshToken }
                });
            }).then((authTokens) => {
                user.accessToken = authTokens.accessToken
                user.refreshToken = authTokens.refreshToken
                res.send(user);
            }).catch((e) => {
                res.status(400).send(e);
            })
        }
    }).catch((e) =>{
        res.send(e)
    })
})

router.post('/signInWithFacebookUrl', (req,res) => {
    User.find({
        email : req.body.email
    }).then((foundUser) =>{
        if(foundUser.length > 0)
        {
            User.findByEmail(req.body.email).then((user) => {
                return user.createSession().then((refreshToken) => {
                    return user.generateAccessAuthToken().then((accessToken) => {
                        return { accessToken, refreshToken }
                    });
                }).then((authTokens) => {
                    user.accessToken = authTokens.accessToken
                    user.refreshToken = authTokens.refreshToken
                    res.send(user);
                })
            }).catch((e) => {
                res.status(400).send(e);
            });
        }
        else
        {
            let date_ob = new Date();
            let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            let date = ("0" + date_ob.getDate()).slice(-2);
            let year = date_ob.getFullYear();
            req.body.joinedDate = months[month-1] + ' ' + date + ', ' + year;
            userData = req.body
            let user = new User(userData)
            user.save().then(() => {
                return user.createSession();
            }).then((refreshToken) => {
                return user.generateAccessAuthToken().then((accessToken) => {
                    return { accessToken, refreshToken }
                });
            }).then((authTokens) => {
                user.accessToken = authTokens.accessToken
                user.refreshToken = authTokens.refreshToken
                res.send(user);
            }).catch((e) => {
                res.status(400).send(e);
            })
        }
    }).catch((e) =>{
        res.send(e)
    })
})

var storeEmail = '';

router.post('/begin_password_reset',(req,resp) => {
    let userData = req.body
    User.findOne({email : userData.email}, (error,user) => {
              if(error)
              {

              }
              if(!user)
              {
                  resp.status(404).send("We couldn't find your account with that information, Please try Again")
              }
              else
              {
                this.storeEmail = user.email
                resp.status(200).send(true)
              }
    })
})

router.get('/getEmailUrl', (req,res) => {
    if(this.storeEmail != undefined)
    {
            res.status(200).json({
            email: this.storeEmail
        })
    }
    else
    {
        res.status(404).send("Couldn't find email address to send to")
    }
})

router.post("/sendmail", (req, res) => {
    let email = req.body.email;
    sendMail(email, info => {
        res.send(info);
      }
    );
  });

async function sendMail(email, callback) {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "visitegypt.kh@gmail.com",
        pass: "zrvziysjwwghqusb"
      }
    }); 

    const mailOptions = {
    from: "visitegypt.kh@gmail.com",
    to: email,
    subject: "Password reset request",
    html: `<h2>Reset your password?</h2> 
            <p> If you requested a password reset for ${ email }, 
            use the confirmation code below to complete the process. 
            If you didn't make this request, ignore this email.
            <h2> ${ getRandom() } </h2> </p?
            <h3> Getting a lot of password reset emails? </h3>
            <p> You can change your <a href = "http://localhost:4200/profile"> account settings </a> to require personal information to reset your password. </p>`
    };
  let info = await transporter.sendMail(mailOptions);
  callback(info)
  }
  
  var randomCode = Math.random().toString(36).substr(2, 3) + "-" + Math.random().toString(36).substr(2, 3) + "-" + Math.random().toString(36).substr(2, 4);

    function getRandom()
    {
        return randomCode;
    }
    
  router.post('/confirm_pin_reset',(req,resp) => {
    let code = req.body.code
    if(getRandom() == code)
    {
      resp.status(200).send(true)
    }
    else
    {
      resp.status(405).send("Incorrect code. Please try again.")
    }
  })

  router.post('/reset_password', (req,resp) => {
      if(this.storeEmail == undefined)
      {
        resp.status(404).send("Couldn't find email address to send to")
        resp.end();
      }
    let userData = req.body
    User.findOne({email : this.storeEmail}, (error,user) => {
      if(error)
        {

        }

    if (userData.newpassword != userData.retypepassword) 
        {
            resp.status(405).send("Passwords do not match, please try again")
        } 
    else
        {
            User.updateOne(user, {password: userData.newpassword})
            .then ((error,user) => {
            resp.status(200).send(true)
         })
        }  
    })    
})

router.post("/sendUserMail", (req, res) => {
    let userEmail = req.body.userEmail;
    let message = req.body.message;
    if(userEmail && message)
    {
        sendMailMessages(userEmail, message, info => {
            res.send(info);
          })
    }
    else
    {
        return res.status(400).send({
            message: 'This is an error!'
         });
    }
  });

async function sendMailMessages(userEmail, message, callback) {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "messagesvisitegypt@gmail.com",
        pass: "ljgmxfwfmmgqpswp"
      }
    }); 

    const mailOptions = {
    from: "messagesvisitegypt@gmail.com",
    to: "visitegypt.kh@gmail.com",
    subject: "User Message",
    html: `<h2> ${ userEmail } </h2> <p> has a message for us </p>
            <h3> ${ message } </h3>
            <p> Click on the email above and reply.. </p>`
    };
  let info = await transporter.sendMail(mailOptions);
  callback(info)
  }

let CairoPlaces = ["Pyramids", "Egyptian Museum", "Al-Azhar", "Saqqara", "Khan El-Khalili", "Citadel", "Tanis", "Zamalek"]
let Alexplaces = ["Bibliotheca Alexandria", "Corniche", "Fort Qaitbey", "Kom El-Dikka", "National Muesum", "Montazah Gardens", "Fish Resturant"]
let SharmPlaces = ["Ras Mohammed", "Thistlegorm Wreck", "Jolanda Reef Site", "Climb Mt. Sinai"]
let HurghadaPlaces = ["Giftun Islands", "Straits Of Gubal", "Explore deseret with Jeep", "Gota Abu Ramada", "Snorkeling", "Bedouin Dinner Tours"]
let LuxorPlaces = ["Temple Of Karnak", "Valley Of The Kings", "Hot Air Balloon Ride Over Luxor At Sunrise", "Luxor Temple", "Temple Of Deir Al-Bahri (Queen Hatshepsut's Temple)"]
let AncientPlaces = ["Memphis City", "Thebes City", "Amarna City", "Avaris City", "Thonis City", "Abydos City"]
let Beaches = ["Naama Bay", "Dahab Lagoon", "El Gouna", "Saqqara", "Marsa Alam", "Soma Bay", "Mamoura Beach"]

let pyrmaids = [
    {
        "title": 'Pyramids',
        "description": "The Egyptian pyramids are ancient masonry structures located in Egypt. Sources cite at least 118 identified Egyptian pyramids. Most were built as tombs for the country's pharaohs and their consorts during the Old and Middle Kingdom periods. The earliest known Egyptian pyramids are found at Saqqara, northwest of Memphis, although at least one step-pyramid-like structure has been found at Saqqara, dating to the First Dynasty: Mastaba 3808, which has been attributed to the reign of Pharaoh Anedjib, with inscriptions, and other archaeological remains of the period, suggesting there may have been others. The otherwise earliest among these is the Pyramid of Djoser built c. 2630–2610 BCE during the Third Dynasty. This pyramid and its surrounding complex are generally considered to be the world's oldest monumental structures constructed of dressed masonry. The most famous Egyptian pyramids are those found at Giza, on the outskirts of Cairo. Several of the Giza pyramids are counted among the largest structures ever built. The Pyramid of Khufu is the largest Egyptian pyramid. It is the only one of the Seven Wonders of the Ancient World still in existence; this is despite being the oldest wonder by about 2,000 years.",
        "location": "cairo",
        "imgCoverURL": "placesDetailsPics/pyramids1.jpeg",
        "imgURL": "placesDetailsPics/pyramids2.jpeg"
    }
]

let egyptianMuseum = [
    {
        "title": 'Egyptian Museum',
        "description": "The Museum of Egyptian Antiquities, known commonly as the Egyptian Museum or the Cairo Museum , in Cairo, Egypt, is home to an extensive collection of ancient Egyptian antiquities. It has 120,000 items, with a representative amount on display and the remainder in storerooms. Built in 1901 by the Italian construction company, Garozzo-Zaffarani, to a design by the French architect Marcel Dourgnon, the edifice is one of the largest museums in the region. As of March 2019, the museum was open to the public. In 2021, the museum is due to be superseded by the newer and larger Grand Egyptian Museum at Giza. The Egyptian Museum of Antiquities contains many important pieces of ancient Egyptian history. It houses the world's largest collection of Pharaonic antiquities. The Egyptian government established the museum built in 1835 near the Ezbekieh Garden and later moved to the Cairo Citadel. In 1855, Archduke Maximilian of Austria was given all of the artifacts by the Egyptian government; these are now in the Kunsthistorisches Museum, Vienna.",
        "location": "cairo",
        "imgCoverURL": "placesDetailsPics/egyptMuseum2.jpeg",
        "imgURL": "placesDetailsPics/egyptMuseum1.jpeg"
    }
]

let alAzhar = [
    {
        "title": 'Al-Azhar',
        "description": "Al-Azhar is one of the relics of the Isma'ili Shi'a Fatimid dynasty, which claimed descent from Fatimah, daughter of Muhammad and wife of Ali son-in-law and cousin of Muhammad. Fatimah was called al-Zahra (the luminous), and the institution was named in her honor.[10] It was founded as mosque by the Fatimid commander Jawhar al-Siqilli at the orders of the Caliph and Imam Al-Mu'izz li-Din Allah as he founded the city for Cairo. It was begun (probably on Saturday) in Jumada al-Awwal in the year AH 359 (March/April 970 CE). Its building was completed on the 9th of Ramadan in the year AH 361 (24 June 972 CE). Both Caliph al-Aziz Billah and Caliph Al-Hakim bi-Amr Allah added to its premises. It was further repaired, renovated and extended by al-Mustansir Billah and al-Hafiz li-Din Allah. The Fatimid caliphs always encouraged scholars and jurists to have their study-circles and gatherings in this mosque and thus it was turned into a madrasa which has the claim to be considered as the oldest such institution still functioning. Interior of Al-Azhar mosque left Studies began at Al-Azhar in the month of Ramadan, 975. According to Syed Farid Alatas, the Jami'ah had faculties in Islamic law and jurisprudence, Arabic grammar, Islamic astronomy, Islamic philosophy, and logic.[12][13] The Fatimids gave attention to the philosophical studies at the time when rulers in other countries declared those who were engaged in philosophical pursuits as apostates and heretics. The Greek thought found a warm reception with the Fatimids who expanded the boundaries of such studies. They paid much attention to philosophy and gave support to everyone who was known for being engaged in the study of any branch of philosophy. The Fatimid Caliph invited many scholars from nearby countries and paid much attention to college books on various branches of knowledge and in gathering the finest writing on various subjects and this in order to encourage scholars and to uphold the cause of knowledge. These books were destroyed by Saladin.",
        "location" : "cairo",
        "imgCoverURL": "placesDetailsPics/al-azhar1.jpeg",
        "imgURL": "placesDetailsPics/al-azhar2.jpeg"
    }
]

let saqqara = [
    {
        "title": 'Saqqara',
        "description": "Saqqara (Arabic: سقارة‎, also spelled Sakkara or Saccara in English, is an Egyptian village in Giza Governorate, that's known for its vast, ancient burial ground of Egyptian pharaohs (kings) and royals, serving as the necropolis for the ancient Egyptian capital, Memphis. Saqqara contains numerous pyramids, including the world-famous Step pyramid of Djoser, sometimes referred to as the Step Tomb, and a number of mastaba tombs. Located some 30 km (19 mi) south of modern-day Cairo, Saqqara covers an area of around 7 by 1.5 km (4.3 by 0.9 mi). Saqqara contains the oldest complete stone building complex known in history, the Pyramid of Djoser, built during the Third Dynasty. Another sixteen Egyptian kings built pyramids at Saqqara, which are now in various states of preservation. High officials added private funeral monuments to this necropolis during the entire Pharaonic period. It remained an important complex for non-royal burials and cult ceremonies for more than 3,000 years, well into Ptolemaic and Roman times. North of the area known as Saqqara lies Abusir, and south lies Dahshur. The area running from Giza to Dahshur has been used as a necropolis by the inhabitants of Memphis at different times, and it was designated as a World Heritage Site by UNESCO in 1979. Some scholars believe that the name Saqqara is not derived from the ancient Egyptian funerary deity, Sokar, but from a local Berber tribe called Beni Saqqar.",
        "location" : "cairo",
        "imgCoverURL": "placesDetailsPics/saqqara2.jpeg",
        "imgURL": "placesDetailsPics/saqqara1.jpeg"
    }
]

let khan = [
    {
        "title": 'Khan El-Khalili',
        "description": "Khan el-Khalili (Arabic: خان الخليلي‎) is a famous bazaar and souq (or souk) in the historic center of Cairo, Egypt. Established as a center of trade in the Mamluk era and named for one of its several historic caravanserais, the bazaar district has since become one of Cairo's main attractions for tourists and Egyptians alike. It is also home to many Egyptian artisans and workshops involved in the production of traditional crafts and souvenirs. Cairo itself was originally founded in 969 CE as a royal city and capital for the Fatimid Caliphate, an empire which by then covered much of North Africa, parts of the Levant and Hijaz. Jawhar Al-Siqilli, the general who had just conquered Egypt for the Fatimids, was ordered to construct a great palace complex to house the caliphs, their household, and the state's institutions.[1] Two palaces were eventually completed: an eastern one (the largest of the two) and a western one, between which was an important plaza known as Bayn al-Qasrayn (Between the Two Palaces). The site of Khan el-Khalili today was originally the southern end of the eastern Great Fatimid Palace, as well as the location of the burial site of the Fatimid caliphs: a mausoleum known as Turbat az-Za'faraan (the Saffron Tomb).[2][3][1]: 57  Also located here was a lesser palace known as al-Qasr al-Nafi'i (today the site of the 19th-century Wikala of Sulayman Agha al-Silahdar)",
        "location" : "cairo",
        "imgCoverURL": "placesDetailsPics/khan1.jpeg",
        "imgURL": "placesDetailsPics/khan2.jpeg"
    }
]

let citadel = [
    {
        "title": 'Citadel',
        "description": "The Citadel of Cairo or Citadel of Saladin (Arabic: قلعة صلاح الدين‎, romanized: Qalaʿat Salāḥ ad-Dīn) is a medieval Islamic-era fortification in Cairo, Egypt, built by Salah ad-Din (Saladin) and further developed by subsequent Egyptian rulers. It was the seat of government in Egypt and the residence of its rulers for nearly 700 years from the 13th to the 19th centuries. Its location on a promontory of the Mokattam hills near the center of Cairo commands a strategic position overlooking the city and dominating its skyline. At the time of its construction, it was among the most impressive and ambitious military fortification projects of its time. It is now a preserved historic site, including mosques and museums. In addition to the initial Ayyubid-era construction begun by Saladin in 1176, the Citadel underwent major development during the Mamluk Sultanate that followed, culminating with the construction projects of Sultan al-Nasir Muhammad in the 14th century. In the first half of the 19th century Muhammad Ali Pasha demolished many of the older buildings and built new palaces and monuments all across the site, giving it much of its present form. In the 20th century it was used as a military garrison by the British occupation and then by the Egyptian army until being opened to the public in 1983. In 1976, it was proclaimed by UNESCO as a part of the World Heritage Site Historic Cairo (Islamic Cairo) which was the new centre of the Islamic world, reaching its golden age in the 14th century.",
        "location" : "cairo",
        "imgCoverURL": "placesDetailsPics/citadel1.jpeg",
        "imgURL": "placesDetailsPics/citadel2.jpeg"
    }
]

let tanis = [
    {
        "title": 'Tanis',
        "description": "Tanis is the Greek name for ancient Egyptian ḏꜥn.t, an important archaeological site in the north-eastern Nile Delta of Egypt, and the location of a city of the same name. It is located on the Tanitic branch of the Nile, which has long since silted up. The first study of Tanis dates to 1798 during Napoléon Bonaparte's expedition to Egypt. Engineer Pierre Jacotin drew up a map of the site in the Description de l'Égypte. It was first excavated in 1825 by Jean-Jacques Rifaud, who discovered the two pink granite sphinxes now in the Musée du Louvre, and then by François Auguste Ferdinand Mariette between 1860 and 1864, and subsequently by William Matthew Flinders Petrie from 1883 to 1886. The work was taken over by Pierre Montet from 1929 to 1956, who discovered the royal necropolis dating to the Third Intermediate Period in 1939. The Mission française des fouilles de Tanis (MFFT) has been studying the site since 1965 under the direction of Jean Yoyotte and Philippe Brissaud, and François Leclère since 2013. Today, the main parts of the temple dedicated to Amun-Re can still be distinguished by the presence of large obelisks that marked the various pylons as in other Egyptian temples. Now fallen to the ground and lying in a single direction, they may have been knocked down by a violent earthquake during the Byzantine era. They form one of the most notable aspects of the Tanis site. Archaeologists have counted more than twenty. This accumulation of remnants from different epochs contributed to the confusion of the first archaeologists who saw in Tanis the biblical city of Zoan in which the Hebrews would have suffered pharaonic slavery. Pierre Montet, in inaugurating his great excavation campaigns in the 1930s, began from the same premise hoping to discover traces that would confirm the accounts of the Old Testament. His own excavations gradually overturned this hypothesis, even if he was defending this biblical connection until the end of his life. It was not until the discovery of Qantir/Pi-Ramesses and the resumption of excavations under Jean Yoyotte that the place of Tanis was finally restored in the long chronology of the sites of the delta.",
        "location" : "cairo",
        "imgCoverURL": "placesDetailsPics/tanis1.jpeg",
        "imgURL": "placesDetailsPics/tanis2.jpeg"
    }
]

let library = [
    {
        "title": 'Bibliotheca Alexandria',
        "description": "The Bibliotheca Alexandrina ('Library of Alexandria'; Egyptian Arabic: مكتبة الإسكندرية‎ Maktabet al-Eskendereyya, is a major library and cultural center on the shore of the Mediterranean Sea in the Egyptian city of Alexandria. It is a commemoration of the Library of Alexandria that was lost in antiquity. The idea of reviving the old library dates back to 1974, when a committee set up by Alexandria University selected a plot of land for its new library. Construction work began in 1995 and, after some US$220 million had been spent, the complex was officially inaugurated on 16 October 2002. In 2010, the library received a donation of 500,000 books from the Bibliothèque nationale de France (BnF). The gift makes the Bibliotheca Alexandrina the sixth-largest Francophone library in the world. The library has shelf space for eight million books, with the main reading room covering 20,000 square metres (220,000 sq ft). The complex also houses a conference center; specialized libraries for maps, multimedia, the blind and visually impaired, young people, and for children; four museums; four art galleries for temporary exhibitions; 15 permanent exhibitions; a planetarium; and a manuscript restoration laboratory.",
        "location" : "Alexandria",
        "imgCoverURL": "placesDetailsPics/library.jpeg",
        "imgURL": "placesDetailsPics/libraryCover.jpeg"
    }
]

let qaitbey = [
    {
        "title": 'Fort Qaitbey',
        "description": "The Citadel of Qaitbay (or the Fort of Qaitbay; Arabic: قلعة قايتباي‎) is a 15th-century defensive fortress located on the Mediterranean sea coast, in Alexandria, Egypt. It was established in 1477 AD (882 AH)[citation needed] by Sultan Al-Ashraf Sayf al-Din Qa'it Bay. The Citadel is situated on the eastern side of the northern tip of Pharos Island at the mouth of the Eastern Harbour. The Qaitbay Citadel in Alexandria is considered one of the most important defensive strongholds, not only in Egypt, but also along the Mediterranean Sea coast. It formulated an important part of the fortification system of Alexandria in the 15th century AD.",
        "location" : "Alexandria",
        "imgCoverURL": "placesDetailsPics/qaitbey1.jpeg",
        "imgURL": "placesDetailsPics/qaitbey2.jpeg"
    }
]

let giftun = [
    {
        "title": 'Giftun Islands',
        "description": "TThe Giftun Islands (also spelled Giftoun) are two islands in the Red Sea near Hurghada in Egypt. Giftun Kebir (جفتون الكبيرة) or Big Giftun is located further west and closer to Hurghada. Giftun Soraya (جفتون ثريا) or Little Giftun is further east. Giftun Island is one of the top destination island in Hurghada. Amuse yourself with the colorful corals and many different kind of red sea fishes swimming around the surface. Set your spirit free and enjoy amazing snorkeling experience to discover the wonderful underwater world on Red Sea's blue ocean.",
        "location" : "El Gouna",
        "imgCoverURL": "placesDetailsPics/giftunCover.jpeg",
        "imgURL": "placesDetailsPics/giftun.jpeg"
    }
]

let gubal = [
    {
        "title": 'Straits Of Gubal',
        "description": "The Strait of Gubal connects the Gulf of Suez and the Red Sea and is bordered to the west by the Egyptian coast and to the east by the Sinai Peninsula. Because of its different geological origin the Gulf of Suez is much shallower than the Gulf of Aqaba. Its average depth is about 80 m only.  The strait is flanked to the northeast by two outcrops called Beacon Rock and Shag Rock. To the southwest the southern tip of the Shadwan Island delimits the canal. The south-eastern area of the strait is characterized by two massive, half-outcropping reef systems, called Sha'ab Mahmud and Sha'ab Ali with shallow lagoons and sand floors inside. Sha'ab Mahmud consists of a coral reef oriented in a northwest-southeast direction, cut through by two channels and completely open on its southern side. The lagoon is navigable and is usually used by boats when going to Thistlegorm as it is well sheltered from waves. Boats enter and exit through the Big Passage only. Cross the Gulf of Suez to reach Abu Nuhas, a reef that is located at the south entrance to the Straits of Gubal between Gubal and Shadwan Island. The area is a group of small submerged islands that have been the cause of many sunken ships.",
        "location" : "El Gouna",
        "imgCoverURL": "placesDetailsPics/gubalCover.jpeg",
        "imgURL": "placesDetailsPics/gubal.jpg"
    }
]

let thistlegorm = [
    {
        "title": 'Thistlegorm Wreck',
        "description": "SS Thistlegorm was a British armed Merchant Navy ship built in 1940 by Joseph Thompson & Son in Sunderland, England. She was sunk by German bombers on 6 October 1941 near Ras Muhammad in the Red Sea and is now a well known diving site. Thistlegorm was built by Joseph Thompson & Sons shipyard in Sunderland for the Albyn Line and launched in April 1940. She was powered by a triple-expansion steam engine rated to 1,850 hp (1,380 kW). The vessel was privately owned but had been partly financed by the British government and was classified as an armed freighter. She was armed with a 4.7-inch (120 mm) anti-aircraft gun and a heavy-calibre machine gun attached after construction to the stern of the ship. She was one of a number of 'Thistle' ships owned and operated by the Albyn Line, which was founded in 1901, based in Sunderland, and had four vessels at the outbreak of World War II. The vessel carried out three successful voyages after her launch. The first was to the US to collect steel rails and aircraft parts, the second to Argentina for grain, and the third to the West Indies for rum. Prior to her fourth and final voyage, she had undergone repairs in Glasgow.",
        "location" : "El Gouna",
        "imgCoverURL": "placesDetailsPics/wreckCover.jpeg",
        "imgURL": "placesDetailsPics/wreck.png"
    }
]

let medinetHabu = [
    {
        "title": 'Medinet Habu',
        "description": "Medinet Habu (Arabic: مدينة هابو‎; Egyptian: Tjamet or Djamet; Coptic: ϫⲏⲙⲉ, ϫⲏⲙⲏ, ϫⲉⲙⲉ, ϫⲉⲙⲏ, ϫⲏⲙⲓ and ϭⲏⲙⲓ Djeme or Djemi)[1] is an archaeological locality situated near the foot of the Theban Hills on the West Bank of the River Nile opposite the modern city of Luxor, Egypt. Although other structures are located within the area, the location is today associated almost exclusively (and indeed, most synonymously) with the Mortuary Temple of Ramesses III. Just left of the entrance to the Mortuary Temple of Ramesses III is the Temple of Amun, (Ancient Egyptian: Djeser Set) dating to the 18th Dynasty, built by Hatshepsut and Thutmose III. It has undergone many alterations and modifications over the years, partially in the 20th, 25th, 26th, 29th and 30th Dynasties and the Greco-Roman period.",
        "location" : "Luxor",
        "imgCoverURL": "placesDetailsPics/habu1.jpeg",
        "imgURL": "placesDetailsPics/habu2.jpeg"
    }
]

let templeOfKarnak = [
    {
        "title": 'Temple Of Karnak',
        "description": "The Karnak Temple Complex, commonly known as Karnak (/ˈkɑːr.næk/, which was originally derived from Arabic: خورنق‎ Khurnaq 'fortified village'), comprises a vast mix of decayed temples, pylons, chapels, and other buildings near Luxor, Egypt. Construction at the complex began during the reign of Senusret I in the Middle Kingdom (around 2000–1700 BCE) and continued into the Ptolemaic Kingdom (305–30 BCE), although most of the extant buildings date from the New Kingdom. The area around Karnak was the ancient Egyptian Ipet-isut ('The Most Selected of Places') and the main place of worship of the 18th Dynastic Theban Triad, with the god Amun as its head. It is part of the monumental city of Thebes, and in 1979 it was inscribed on the UNESCO World Heritage List along with the rest of the city. The Karnak complex gives its name to the nearby, and partly surrounded, modern village of El-Karnak, 2.5 kilometres (1.6 miles) north of Luxor.",
        "location" : "Luxor",
        "imgCoverURL": "placesDetailsPics/karnakCover.jpeg",
        "imgURL": "placesDetailsPics/karnak.jpeg"
    }
]

let thebes = [
    {
        "title": 'Thebes City',
        "description": "Thebes (Arabic: طيبة‎, Ancient Greek: Θῆβαι, Thēbai), known to the ancient Egyptians as Waset, was an ancient Egyptian city located along the Nile about 800 kilometers (500 mi) south of the Mediterranean. Its ruins lie within the modern Egyptian city of Luxor. Thebes was the main city of the fourth Upper Egyptian nome (Sceptre nome) and was the capital of Egypt for long periods during the Middle Kingdom and New Kingdom eras. It was close to Nubia and the Eastern Desert, with its valuable mineral resources and trade routes. It was a cult center and the most venerated city during many periods of ancient Egyptian history. The site of Thebes includes areas on both the eastern bank of the Nile, where the temples of Karnak and Luxor stand and where the city was situated; and the western bank, where a necropolis of large private and royal cemeteries and funerary complexes can be found. In 1979, the ruins of ancient Thebes were classified by UNESCO as a World Heritage Site.",
        "location" : "cairo",
        "imgCoverURL": "placesDetailsPics/thebes1.jpeg",
        "imgURL": "placesDetailsPics/thebes2.jpeg"
    }
]

let elGouna = [
    {
        "title": 'El-Gouna Beach',
        "description": "The purpose-built beach town of El Gouna, 27 kilometers north of Hurghada , was made for easygoing, family-friendly sun-and-sand vacations. El Gouna is dedicated to resort-style holidays that offer plenty of diversions off the beach for those who want to do more than soak up the sun, with stand up paddleboarding, kayaking, horse riding, and desert ATV tours all available, along with an 18-hole golf course. There are four main beach areas, including the wide swath of Mangroovy Beach, which is El Gouna's kitesurfing central, and the soft white sand of Zeytouna Beach, with its 400-meter-long jetty allowing you to stroll out to the deeper water where the coral reefs lie to conserve your energy for snorkeling. Most of the hotels here are large, low-slung resorts surrounded by mature gardens of palm trees that lead out to the beach, such as the Sheraton Miramar Resort , though there's a couple of smaller midrange options that focus on attracting visitors who've come here purely to kitesurf.",
        "location" : "El Gouna",
        "imgCoverURL": "placesDetailsPics/gouna1.jpeg",
        "imgURL": "placesDetailsPics/gouna2.jpeg"
    }
]

 router.get('/users/me/access-token', verifySession, (req, res) => {
    req.userObject.generateAccessAuthToken().then((accessToken) => {
        res.header('x-access-token', accessToken).send({ accessToken });
    }).catch((e) => {
        res.status(400).send(e);
    });
})

module.exports = router