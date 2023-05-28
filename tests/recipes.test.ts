import setupTest from "./setup"
import { closeDbConnection } from "./utils/db";

beforeAll(async ()=>{
    await setupTest();
})
beforeEach(()=>{
    
})
afterEach(()=>{

})
afterAll(async ()=>{
    await closeDbConnection();
})


test("testing",()=>{
    expect(0).toBe(0);
    return;
})