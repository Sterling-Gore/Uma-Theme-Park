const pool = require('../database')


async function runQuery(){
    try{
        const sqlQuery = "SELECT * FROM theme_park.merchandise_notification;";
        const [rows] = await pool.execute(sqlQuery);
        return rows;
    } catch(err){
        console.error("Database error:", err);
        throw err;
    }
}


async function getTasks(req, res){
    try{
        const tasks = await runQuery();

        if(!tasks || tasks.length === 0){
            res.writeHead(401, JSON.stringify({'Content-type' : 'application/json'}));
            return res.end(JSON.stringify({message : 'no tasks available'}));
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({tasks}));
    } catch(err){
        res.writeHead(500, JSON.stringify({'Content-type' : 'application/json'}));
        return res.writeHead(JSON.stringify({message: "Internal server error"}));
    }


}

module.exports = {
    getTasks
}