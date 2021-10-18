module.exports = function reg(pool) {

    //try es6
  
    var insertReg = async (regNo) => {
        try {
            if (regNo.length < 7 || regNo.length > 10) {
                return null;
            }
            else if (regNo.startsWith('CA') || regNo.startsWith('CJ') || regNo.startsWith('CK')) {
                await add(regNo);
            }

        } catch (error) {
            console.log(error)
        }
    }

    async function getReg() {
        try {
            let regPlates = await pool.query('SELECT * from regNumbers');
            return regPlates.rows;

        } catch (error) {
            console.log(error);
        }

    }

    async function getTownId(townTag) {
        try {
            let result = await pool.query('select townId from towns where reg_code = $1', [townTag])
            return result.rows[0].townid

        } catch (error) {
            console.log(error)
        }
    }

    async function add(reg) {
        try {
            var town_code = reg.substring(0, 2)
            var town = await getTownId(town_code);
            // console.log('town code gyugyttuyt   :' + town);

            var checkReg = await pool.query(`select reg_numbers from regNumbers where reg_numbers = $1`, [reg])
            if (checkReg.rowCount == 0) {
                await pool.query(`insert into regNumbers(reg_numbers,town_id) values ($1,$2)`, [reg, town])
            }

        } catch (error) {
            console.log(error);
        }
    }
    async function filter(area) {

        try {
            var idForTown = await getTownId(area)
            // console.log('hsdfghjklasdfghjk  ' + idForTown);
            var place = await pool.query(`select reg_numbers from regNumbers where town_id = $1`, [idForTown]);

            return place.rows;

        } catch (error) {
            console.log(error);
        }
    }

    async function specificRegPlate(regNo) {

        try {
            var oneReg = await pool.query(`select reg_numbers from regNumbers where reg_numbers = $1`, [regNo]);
            if (oneReg.rowCount > 0) {
                return oneReg.rows[0];
            }
        
        } catch (error) {
            console.log(error)
        }

    }
    async function deleteReg() {
        try {
            await pool.query('DELETE FROM regNumbers');

        } catch (error) {
            console.log(error);
        }
    }

    return {
        add,
        insertReg,
        getReg,
        deleteReg,
        filter,
        specificRegPlate,
        getTownId,
    }
}