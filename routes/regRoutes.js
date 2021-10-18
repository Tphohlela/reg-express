module.exports = function routesReg(reg) {
    

    async function index(req, res) {
        try {
            // console.log('array:  ' + reg.getReg())
            res.render('index', {
              display: await reg.getReg(),
            })
        
          } catch (error) {
            console.log(error);
          }  
    }
    async function getRegValue(req, res) {
        try {
            console.log('reg:  ' + req.body.name.length);
            const text = req.body.name
        
            var regex = /[`~!@#$%^&*()_|+=?;:'",.<>{}[\]\\/`]/;
        
            if (text === null || text == Number(text) || text.match(regex) || text.length < 7 || text.length > 10) {
              req.flash('error', 'Please enter a valid registration number');
            }
        
            else if (!text.startsWith('C')) {
              req.flash('error', 'Please enter a registration number from towns listed below');
            }
            await reg.insertReg(req.body.name);
        
          } catch (error) {
            console.log(error);
          }
          res.redirect('/');
    }

    async function showAll(req,res){
        res.redirect('/');
    }

    async function filterTown(req,res){
        try {
            console.log('radio   ' +req.body.langRadioBtn);
        
            if (!req.body.langRadioBtn) {
              req.flash('error', 'Please select a town');
            }
            res.render("index", {
              display: await reg.filter(req.body.langRadioBtn),
            });
        
          } catch (error) {
            console.log(error);
          }
    }

    async function clear(req,res){
        req.flash('msg', 'You have resetted successfully');
        await reg.deleteReg();
        res.redirect("/");
    }


    async function regURL(req,res){
        const regPlate1 = req.params.specificReg;

        const oneReg = await reg.specificRegPlate(regPlate1);
        console.log('specific reg plate :' + regPlate1); 
        console.log('sdfghjksdfghjk :' + oneReg);
        if (oneReg == undefined) {
          req.flash('error', 'The registration number you have entered does not exist');
        }

        res.render("index", {
            display1: oneReg,
            display2: oneReg != undefined
        }); 
    }

  

    return {
        index,
        getRegValue,
        showAll,
        filterTown,
        clear,
        regURL
     
    }
}
