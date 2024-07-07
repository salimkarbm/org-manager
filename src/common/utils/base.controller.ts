export class OkResponse {
  status: string;
  message: string;
  data?: any;
  // result: number | undefined;

  constructor(message: string, data?: any) {
    this.status = 'success';
    this.message = message;

    // Check if data is defined and not empty
    if (data && data.length !== undefined) {
      //  this.result = data.length;
      this.data = data;
    } else {
      this.data = data || undefined;
    }
  }
}
