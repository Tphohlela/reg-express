let assert = require("assert");
let regs = require("../reg");
const pg = require("pg");
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/reg_test';

const pool = new Pool({
    connectionString
});

describe('Test for Registration factory function', function () {
    beforeEach(async function () {
        await pool.query("delete from regNumbers;");
    });

    describe('For errors', function () {
        it('should not display numbers', async function () {
            let reg = regs(pool);

            await reg.insertReg("99");

            let error = await reg.getReg();

            assert.equal(null, error.reg_numbers);
        });

        it('should not display empty string', async function () {
            let reg = regs(pool);

            await reg.insertReg(" ");

            let error = await reg.getReg();

            assert.equal(null, error.reg_numbers);
        });

        it('should not display number plates that do not start with CA,CJ or CK', async function () {
            let reg = regs(pool);

            await reg.insertReg("GP 999 999");

            let error = await reg.getReg();

            assert.equal(null, error.reg_numbers);
        });
    });

    describe('For storing names in database', function () {

        it('should be able to insert a registration number into a table and have 1 row', async function () {

         let reg = regs(pool);

            await reg.add('CA 888 888');

            let regPlate = await reg.getReg();
            assert.equal(1, regPlate.length);
        });

        it('should be able to insert three registration numbers into a table and have 3 rows', async function () {
            let reg = regs(pool);
            await reg.insertReg("CK 888 786");
            await reg.insertReg("CA 888 987");
            await reg.insertReg("CJ 888 432");

            let regPlate = await reg.getReg();
            assert.equal(3, regPlate.length);
        });

        it('should be able to not add duplicate registration number as another row', async function () {
            let reg = regs(pool);
            await reg.insertReg("CK 888 888");
            await reg.insertReg("CK 888 888");
            await reg.insertReg("CJ 888 432");

            let regPlate = await reg.getReg();
            assert.equal(2, regPlate.length);
        });
    });

    describe('For specific town', function () {

        it('should return townId 1 from towns table if CA is entered', async function () {
            let reg = regs(pool);
            assert.equal(1, await reg.getTownId('CA'));
        });

        it('should return townId 2 from towns table if CJ is entered', async function () {
            let reg = regs(pool);
            assert.equal(2, await reg.getTownId('CJ'));
        });

        it('if Cape Town is selected, only the number plates from Cape Town should appear', async function () {
            let reg = regs(pool);
            await reg.insertReg("CA 888 888");
            await reg.insertReg("CK 888 888");
            await reg.insertReg("CJ 888 432");

            let filter = await reg.filter('CA');
            assert.deepEqual([{ reg_numbers: 'CA 888 888' }], filter);
        });

        it('if Paarl is selected, only the number plates from Paarl should appear', async function () {
            let reg = regs(pool);
            await reg.insertReg("CA 888 888");
            await reg.insertReg("CK 888 888");
            await reg.insertReg("CJ 888 432");
            await reg.insertReg("CJ 977 432");

            let filter = await reg.filter('CJ');
            assert.deepEqual([{ reg_numbers: 'CJ 977 432' }],[{ reg_numbers: 'CJ 977 432', }], filter);
        });

        it('if Malmesbury is selected, only the number plates from Malmesbury should appear', async function () {
            let reg = regs(pool);
            await reg.insertReg("CA 888 888");
            await reg.insertReg("CK 888 888");
            await reg.insertReg("CJ 888 432");

            let filter = await reg.filter('CK');
            assert.deepEqual([{ reg_numbers: 'CK 888 888' }], filter);
        });
    });

    describe('For reset ', function () {

        it('should delete table content', async function () {
            let reg = regs(pool);
            await reg.insertReg("CA 888 888");
            await reg.insertReg("CK 888 888");
            await reg.insertReg("CJ 888 432");

            await reg.deleteReg();

            let deleteTable = await reg.getReg();
            assert.deepEqual([], deleteTable);
        });
    });

    describe('For finding out if registration exists in table ', function () {

        it('should return registration number if registration number has been added to table', async function () {
            let reg = regs(pool);
            await reg.insertReg("CA 888 888");
            await reg.insertReg("CK 888 888");
            await reg.insertReg("CJ 888 432");

            let regPlate = await reg.specificRegPlate('CA 888 888');
            assert.deepEqual('CA 888 888', regPlate.reg_numbers);
        });

        it('should return nothing if registration number has not been added to table', async function () {
            let reg = regs(pool);
            await reg.insertReg("CA 888 888");
            await reg.insertReg("CK 888 888");
            await reg.insertReg("CJ 888 432");

            let regPlate = await reg.specificRegPlate('CK 111 111');
            assert.deepEqual(null, regPlate);
        });
    });

})
