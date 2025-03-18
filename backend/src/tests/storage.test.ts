import multer from "multer";
import * as fs from "fs";
import { Request, Response } from "express";
import { deleteFile, uploadFile } from "../common/storage";

jest.mock("multer", () => {
  const multerMock = jest.fn(() => ({
    single: jest.fn(),
  }));
  (multerMock as any).diskStorage = jest.fn(() => ({})); // Mock diskStorage

  return multerMock;
});
jest.mock("fs");

describe("Storage Module", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockMulter: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    mockMulter = multer as unknown as jest.Mock;
    jest.clearAllMocks();
  });

  //   describe("uploadFile", () => {
  //     it("should successfully upload a file", async () => {
  //         const mockSingle = jest.fn((req, res, cb) => cb(null));
  //         mockMulter.mockReturnValue({ single: mockSingle });

  //       await expect(
  //         uploadFile(mockRequest as Request, mockResponse as Response)
  //       ).resolves.toBeUndefined();
  //       expect(mockSingle).toHaveBeenCalledWith(
  //         mockRequest,
  //         mockResponse,
  //         expect.any(Function)
  //       );
  //     });

  //     it("should fail to upload a file due to multer error", async () => {
  //       const mockSingle = jest.fn((req, res, cb) =>
  //         cb(new Error("Multer Error"))
  //       );
  //       mockMulter.mockReturnValue({ single: mockSingle });

  //       await expect(
  //         uploadFile(mockRequest as Request, mockResponse as Response)
  //       ).rejects.toThrow("Multer Error");
  //       expect(mockSingle).toHaveBeenCalledWith(
  //         mockRequest,
  //         mockResponse,
  //         expect.any(Function)
  //       );
  //     });
  //   });

  describe("deleteFile", () => {
    it("should successfully delete a file", () => {
      const mockUnlink = jest.fn((path, cb) => cb(null));
      jest.spyOn(fs, "unlink").mockImplementation(mockUnlink);

      deleteFile("test.jpg");

      expect(mockUnlink).toHaveBeenCalledWith(
        "public/images/test.jpg",
        expect.any(Function)
      );
    });

    it("should fail to delete a file due to fs error", () => {
      const mockUnlink = jest.fn((path, cb) => cb(new Error("FS Error")));
      jest.spyOn(fs, "unlink").mockImplementation(mockUnlink);

      deleteFile("test.jpg");

      expect(mockUnlink).toHaveBeenCalledWith(
        "public/images/test.jpg",
        expect.any(Function)
      );
    });
  });
});
