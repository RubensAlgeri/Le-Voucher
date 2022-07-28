import voucherService from "./../../src/services/voucherService.js"
import voucherRepository from "../../src/repositories/voucherRepository.js";
import {jest} from "@jest/globals"

describe("voucherService test suite", () => {
  it("create a voucher it should call call createVoucher function", async () => {
    const discount = Math.floor(Math.random()*100+1);
    const code = "es6sefse6f4s6ef4s6ef84se6f4se6f"

    jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce(():any => { return null} )
    jest.spyOn(voucherRepository, "createVoucher").mockImplementationOnce(():any => { return null} ) 

    voucherService.createVoucher(code,discount)

    expect(voucherRepository.getVoucherByCode).toHaveBeenCalledTimes(1)
  })

  it("create voucher already registered it should throw conflict error", async () => {
    const discount = Math.floor(Math.random()*100+1);
    const code = "es6sefse6f4s6ef4s6ef84se6f4se6f"
    jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce(():any => { return { code, discount}} )    
    jest.spyOn(voucherRepository, "createVoucher").mockImplementationOnce(():any => { return null} )    

    const promise = voucherService.createVoucher(code,discount)

    const error = {
      message:"Voucher already exist.",
      type:"conflict"
    }
    expect(promise).rejects.toEqual(error)
  })

  it("apply a voucher it should call applyVoucher function", async () => {
    const discount = Math.floor(Math.random()*100+1);
    const code = "es6sefse6f4s6ef4s6ef84se6f4se6f"
    const amount = Math.floor(Math.random()*1000+100);
    const used = false;

    jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce(():any => { return {code,discount,used}} )
    jest.spyOn(voucherRepository, "useVoucher").mockImplementationOnce(():any => { return null} ) 

    const value = await voucherService.applyVoucher(code,amount)
    
    expect(voucherRepository.getVoucherByCode).toHaveBeenCalled();
    expect(value.finalAmount).toEqual(amount - (amount*(discount/100)))
  })

  it("apply a voucher doesn't registered it should throw conflict error", async () => {
    const discount = Math.floor(Math.random()*100+1);
    const code = "es6sefse6f4s6ef4s6ef84se6f4se6f";
    const amount = Math.floor(Math.random()*1000+1);
    const used = false;

    jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce(():any => { return null} )
    jest.spyOn(voucherRepository, "useVoucher").mockImplementationOnce(():any => { return null} ) 

    const promise = voucherService.applyVoucher(code,amount)
    
    const error = {
      message:"Voucher does not exist.",
      type:"conflict"
    }
    expect(promise).rejects.toEqual(error)
  })
})