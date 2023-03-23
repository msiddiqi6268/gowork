import jwtDecode from "jwt-decode"
import User from "../Models/User"
function authRole(role) {
    return (req, res, next) => {
        const {user_id} = jwtDecode(req.headers['authorization'].split(' ')[1])
        const user = User.findOne({id:user_id})
        if (user.role !== role) {
            res.status(401)
            return res.send('Not allowed')
        }
        next()
    }
}