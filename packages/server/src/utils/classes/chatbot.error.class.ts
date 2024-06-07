export class ChatbotError extends Error {

  constructor(message: string = "Terjadi kesalahan pada chatbot, Silahkan refresh halaman chatbot") {
    super(message);
  }

  get error() {
    return {
      message: this.message,
    };
  }
}

export class DeadEndError extends ChatbotError {
  constructor() {
    super("Maaf, chatbot tidak dapat melanjutkan percakapan");
  }
}

export class DontUnderstandError extends ChatbotError {
  constructor() {
    super("Maaf, chatbot tidak dapat memahami pesan yang dikirimkan, silahkan coba lagi dengan kata lain");
  }
}

export class NotFoundError extends ChatbotError {
  constructor() {
    super("Maaf, tidak ada data yang ditemukan");
  }
}

export class invalidInputError extends ChatbotError {
  constructor() {
    super("Maaf, input yang diberikan tidak valid");
  }
}