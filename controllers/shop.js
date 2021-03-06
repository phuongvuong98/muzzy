const Product = require("../models/product");
const Coffee = require("../models/coffee");
const Teacher = require("../models/teacher");
const User = require("../models/user");
exports.getCoffees = (req, res, next) => {
  Coffee.find()
    .then(coffees => {
      coffees = coffees.filter(p => p.delete_at == undefined);
      console.log(coffees);
      return res.render("shop/coffees", {
        coffees: coffees,
        userr: req.user,
        pageTitle: "Acoustic Coffee",
        path: "/coffees",
        kind: "all",
        kindFilter: []
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getTeachers = (req, res, next) => {
  Teacher.find()
    .then(teachers => {
      teachers = teachers.filter(p => p.delete_at == undefined);
      console.log(teachers);
      return res.render("shop/teachers", {
        teachers: teachers,
        userr: req.user,
        pageTitle: "Người hướng dẫn",
        path: "/teachers",
        kind: "all",
        kindFilter: []
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCoffee = (req, res, next) => {
  const coffeeId = req.params.coffeeId;
  console.log("[GET DETAILED coffee]:", coffeeId);
  User.find()
    .then(users => {
      Coffee.find().then(coffees => {
        Coffee.findById(coffeeId)
          .then(coffee => {
            console.log("Get coffee sucessfully");
            res.render("shop/coffee-detail", {
              coffee: coffee,
              coffees: coffees,
              pageTitle: coffee.title,
              path: "/coffees",
              users: users,
              userr: req.user
            });
          })
          .catch(err => {
            console.log(err);
          });
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getTeacher = (req, res, next) => {
  const teacherId = req.params.teacherId;
  console.log("[GET DETAILED teacher]:", teacherId);
  User.find()
    .then(users => {
      Teacher.find().then(teachers => {
        Teacher.findById(teacherId)
          .then(teacher => {
            console.log("Get teacher sucessfully");
            res.render("shop/teacher-detail", {
              teacher: teacher,
              teachers: teachers,
              pageTitle: teacher.title,
              path: "/teachers",
              users: users,
              userr: req.user
            });
          })
          .catch(err => {
            console.log(err);
          });
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getIndex = (req, res, next) => {
  Teacher.find()
    .then(teachers => {
      Coffee.find()
        .then(coffees => {
          //console.log(products);
          coffees = coffees.filter(p => p.delete_at == undefined);
          // console.log(products);
          return res.render("shop/index", {
            teachers: teachers,
            coffees: coffees,
            userr: req.user,
            pageTitle: "Muzzy",
            path: "/",
            kind: "all",
            kindFilter: []
          });
        })
        .catch(err => {
          console.log(err);
        });
    })

    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then(user => {
      let products = user.cart.items;
      console.log(products);
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
        sum: user.cart.sum,
        userr: req.user
      });
    })
    .catch(err => console.log(err));
};

exports.getJsonCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then(user => {
      res.json({
        sumPrice: user.cart.sum,
        products: user.cart.items
      });
    })
    .catch(err => console.log(err));
};

// them san pham voi vao cart
exports.postCart = (req, res, next) => {
  console.log("Add Product to Cart");
  const productId = req.body.productId;
  var newQuantity = req.body.productNumber;

  Product.findById(productId)
    .then(product => {
      return req.user.addToCart(product, newQuantity);
    })
    .then(result => {
      res.redirect("/cart");
    });
};

exports.postUpdateCart = (req, res, next) => {
  const btnUpdateCart = req.body.btnUpdateCart;
  const btnCheckout = req.body.btnCheckout;
  var newQuantityArr = [];
  var productIdArr = [];
  if (typeof req.body.productId == "string") {
    newQuantityArr = req.body.productNum.split(",");
    productIdArr = req.body.productId.split(",");
  } else {
    newQuantityArr = req.body.productNum;
    productIdArr = req.body.productId;
  }

  console.log("Update cart and checkout");
  console.log(btnUpdateCart);
  console.log(btnCheckout);

  console.log(productIdArr);
  console.log(newQuantityArr);

  let newCouple = [];

  if (typeof productIdArr === "undefined") {
    return res.redirect("/cart");
  }
  for (let i = 0; i < productIdArr.length; i++) {
    newCouple.push({
      productId: productIdArr[i],
      newQuantity: newQuantityArr[i]
    });
  }
  console.log("TCL: exports.postUpdateCart -> newCouple", newCouple);
  console.log("TCL: exports.postUpdateCart -> productIdArr", productIdArr);
  console.log("TCL: exports.postUpdateCart -> btnUpdateCart", btnUpdateCart);

  if (btnUpdateCart == "1") {
    console.log("[SHOP CONTROLLER] Update Cart");

    let promiseUpdateCart = new Promise(function(resolve, reject) {
      resolve(req.user.updateCart(newCouple));
    });

    //Please use timeout > 3s to save Db successfully
    promiseUpdateCart.then(function(rs) {
      setTimeout(function() {
        return res.redirect("/cart");
      }, 3000);
    });
  }

  if (btnCheckout == 1) {
    console.log("[SHOP CONTROLLER] Checkout Cart");

    let oderPromise = new Promise(function(resolve, reject) {
      resolve(req.user.orderProduct());
    });

    //Please use timeout > 3s to save Db successfully
    oderPromise.then(function() {
      setTimeout(function() {
        return res.redirect("/cart");
      }, 3000);
    });
  }
};

exports.getBlog = (req, res, next) => {
  res.render("shop/blog", {
    path: "/blog",
    pageTitle: "Blog",
    userr: req.user
  });
};

exports.getAbout = (req, res, next) => {
  res.render("shop/about", {
    path: "/about",
    pageTitle: "About us",
    userr: req.user
  });
};

exports.getContact = (req, res, next) => {
  res.render("shop/contact", {
    path: "/contact",
    pageTitle: "Contact us",
    userr: req.user
  });
};

exports.getRegister = (req, res, next) => {
  res.render("shop/register", {
    path: "/register",
    pageTitle: "Register",
    userr: req.user
  });
};

exports.searchProduct = (req, res, next) => {
  var namep = req.body.search;
  //var regex = RegExp(".*" + namep + ".*");

  Product.find({
    name: {
      $regex: namep,
      $options: "i"
    }
  })
    .then(products => {
      res.render("shop/search", {
        products: products,
        pageTitle: "Result of " + namep,
        path: "/products",
        kind: "all",
        kindFilter: [],
        userr: req.user
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getComment = (req, res, next) => {
  var ratting = req.body.rating;
  var comment = req.body.review;
  var pid = req.params.productId;
  Product.findById(pid)
    .then(product => {
      return req.user.addToComment(product, comment, ratting);
    })
    .then(result => {
      res.redirect("/products/" + pid);
    });
};
