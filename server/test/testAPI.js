let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../server')

chai.should()

chai.use(chaiHttp)

describe('Tests API', () => {

    describe('POST /register', () => {
        it("it should not register the user due to uniqueness of username", (done) => {
            const user = 
            {
                username : "VisitEgypttt",
                email : "visitEgypt@gmail.com",
                password : "123lol123"
            }
            chai.request(server)
                .post("/api/register")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(405);
                done();
                })
        })
    })

    describe('POST /register', () => {
        it("it should not register the user due to uniqueness of email", (done) => {
            const user = 
            {
                username : "khldwleeddfasfaf",
                email : "visitEgypt@gmail.com",
                password : "123lol123"
            }
            chai.request(server)
                .post("/api/register")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(405);
                done();
                })
        })
    })

    describe('POST /register', () => {
        it("it should not register the user due to not matching password criteria", (done) => {
            const user = 
            {
                username : "khldwleeddfasfaf",
                email : "khaled.garaweenfasfqwf@gmail.com",
                password : "123lol"
            }
            chai.request(server)
                .post("/api/register")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(401);
                done();
                })
        })
    })
    
    describe('POST /register', () => {
        it("it should not register the user due to not matching password criteria of using common words", (done) => {
            const user = 
            {
                username : "khldwleeddfasfaf",
                email : "khaled.garaweenfasfqwf@gmail.com",
                password : "123"
            }
            chai.request(server)
                .post("/api/register")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(401);
                done();
                })
        })
    })

    describe('POST /login', () => {
        it("it should login the user", (done) => {
            const user = 
            {
                email : "visitEgypt@gmail.com",
                password : "123lol123"
            }
            chai.request(server)
                .post("/api/login")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                done();
                })
        })
    })

    describe('POST /login', () => {
        it("it should not let the user to login due to incorrect password", (done) => {
            const user = 
            {
                email : "khaled.garaween@gmail.com",
                password : "123lol123dasda"
            }
            chai.request(server)
                .post("/api/login")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                done();
                })
        })
    })

    describe('GET /getCommentsUrl', () => {
        it("it should return the comments", (done) => {
            chai.request(server)
                .get("/api/getCommentsUrl")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array')
                done();
                })
        })
    })

    describe('GET not /getCommentsUrl', () => {
        it("it should not return the comments rather a 404 since a wrong url provided", (done) => {
            chai.request(server)
                .get("/api/getComments")
                .end((err, res) => {
                    res.should.have.status(404);
                done();
                })
        })
    })

    describe('POST /getCityCommentsUrl', () => {
        it("it should return a list of comments of the passed city", (done) => {
            let city = "cairo"
            chai.request(server)
                .post("/api/getCityCommentsUrl")
                .send(city)
                .end((err, res) => {
                    res.should.have.status(200);
                done();
                })
        })
    })

    describe('POST /begin_password_reset', () => {
        it("it should return an error since it is non existing user", (done) => {
            let email = "khaled.garaweenkaslfmkaslkermla@gmail.com"
            chai.request(server)
                .post("/api/begin_password_reset")
                .send(email)
                .end((err, res) => {
                    res.should.have.status(404);
                done();
            })
        })
    })

    describe('POST /begin_password_reset', () => {
        it("it should return a status ok since it is an existing user", (done) => {
            let email = "visitEgypt@gmail.com"
            chai.request(server)
                .post("/api/begin_password_reset")
                .send({email})
                .end((err, res) => {
                    res.should.have.status(200);
                done();
            })
        })
    })

    describe('POST /getEmailUrl', () => {
        it("it should return a status ok since storing the email was set in the request before", (done) => {
            chai.request(server)
                .get("/api/getEmailUrl")
                .end((err, res) => {
                    res.should.have.status(200);
                done();
            })
        })
    })

    describe('POST /sendmail', () => {
        it("it should return a status ok and send an email to the provided email below", (done) => {
            let email = "visitEgypt@gmail.com"
            chai.request(server)
                .post("/api/sendmail")
                .send({email})
                .end((err, res) => {
                    res.should.have.status(200);
                done();
            })
        })
    })

    describe('POST /reset_password', () => {
        it("it should return a status ok and update the password for the user wit the provided email in the previous request", (done) => {
            let user = {
                newpassword : "123lol123",
                retypepassword : "123lol123"
            }
            chai.request(server)
                .post("/api/reset_password")
                .send({user})
                .end((err, res) => {
                    res.should.have.status(200);
                done();
            })
        })
    })

    describe('POST /reset_password', () => {
        it("it should return an error since passwords do not match", (done) => {
            let user = {
                newpassword : "123lol123",
                retypepassword : "123lol12322"
            }
            chai.request(server)
                .post("/api/reset_password")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(405);
                done();
            })
        })
    })
})
