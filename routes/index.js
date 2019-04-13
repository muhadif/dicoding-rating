var express = require('express');
var router = express.Router();
var sql = require('mssql');



/* GET home page. */
router.get('/', function(req, res, next) {
  const request = new sql.Request();
  request.query(
      'select * from review.rating', function (error, data) {
        if(error) console.log(error);

        res.render('restaurant/index', {
          title : "Rating",
          restaurants : data.recordset
        })

      }
  )
});

router.get('/create', function(req, res, next) {
    var b = 10
  res.render('restaurant/create', { title: 'Add' });
});

router.post('/create', function(req, res, next) {
  var transaction = new sql.Transaction()
  var name = req.body.name;
  var address = req.body.address;
  var rating = req.body.rating;

  transaction.begin(err => {
      const request = new sql.Request(transaction)
      request.query("insert into review.rating(name, address, rating) values('" + name +
          "', '"+  address + "', '" + rating + "');", (err, result) => {
          if(err) console.log('Error insert' + err)

          transaction.commit(err => {
              if(err) console.log('Error commit' + err);

              res.redirect('/')

              console.log('Transaction commited');
          })
      });
  } )
});

router.get('/:id/edit', function(req, res, next) {
    const request = new sql.Request();
    const id = req.params.id

    request.query(
        'select * from review.rating', function (error, data) {
            if(error) console.log(error);

            res.render('restaurant/edit', {
                title : data.recordset[0].id,
                restaurant : data.recordset[0]
            })

            console.log(data.recordset[0])

        }
    )
});

router.post('/:id/edit', function (req, res, next) {
    var transaction = new sql.Transaction()
    var id = req.params.id
    var name = req.body.name;
    var address = req.body.address;
    var rating = req.body.rating;

    transaction.begin(err => {
        const request = new sql.Request(transaction)
        request.query("update review.rating set name='" + name + "', address ='" + address +
            "', rating = " + rating + " where id=" + id + " " , (err, result) => {
            if(err) console.log('Error update' + err)

            transaction.commit(err => {
                if(err) console.log('Error commit' + err);

                res.redirect('/')
                console.log('Transaction commited');
            })
        });
    } )
})
router.post('/:id/delete', function(req, res, next) {
    var transaction = new sql.Transaction()
    var id = req.params.id
    transaction.begin(err => {
        const request = new sql.Request(transaction)
        request.query("delete review.rating where id = " + id, (err, result) => {
            if(err) console.log('Error update' + err)

            transaction.commit(err => {
                if(err) console.log('Error commit' + err);

                res.redirect('/')
                console.log('Transaction commited');
            })
        });
    } )

});

module.exports = router;
