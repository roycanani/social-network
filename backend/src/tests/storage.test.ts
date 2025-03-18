import * as fs from "fs";
import { deleteFile } from "../common/storage";

jest.mock("multer", () => {
  const multerMock = jest.fn(() => ({
    single: jest.fn(),
  }));
  // eslint-disable-next-line
  (multerMock as any).diskStorage = jest.fn(() => ({})); // Mock diskStorage

  return multerMock;
});
jest.mock("fs");

describe("Storage Module", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
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
