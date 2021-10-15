import rewire from "rewire"
const main = rewire("./main")
const run = main.__get__("run")
const exec = main.__get__("exec")
// @ponicode
describe("run", () => {
    test("0", async () => {
        await run()
    })
})

// @ponicode
describe("exec", () => {
    test("0", async () => {
        await exec("UPDATE Projects SET pname = %s WHERE pid = %s")
    })

    test("1", async () => {
        await exec("DELETE FROM Projects WHERE pid = %s")
    })

    test("2", async () => {
        await exec("SELECT * FROM Movies WHERE Title=’Jurassic Park’ AND Director='Steven Spielberg';")
    })

    test("3", async () => {
        await exec("UNLOCK TABLES;")
    })

    test("4", async () => {
        await exec("DROP TABLE tmp;")
    })

    test("5", async () => {
        await exec("")
    })
})
