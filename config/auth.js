
module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()){
            return next()
        }
        res.redirect('/admin/login')
    },
    forwardAuthenticated: function(req, res, next){
        if(!req.isAuthenticated()){
            return next()
        }
        res.redirect(`/contact`)
    }
}