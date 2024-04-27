// import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
// import { extname } from 'path';

// @Injectable()
// export class ParseFilePipeDocument implements PipeTransform {
//   private readonly allowedExtensions = ['.xlsx'];

//   transform(value: Express.Multer.File): Express.Multer.File {
//     const file = value?.file ? value?.file?.[0] : null;

//     if (file) {
//       console.log('dfslfjsafsfasd saf sf f', file);
//       const extension = extname(file.originalname);
//       if (!this.allowedExtensions.includes(extension)) {
//         throw new BadRequestException(`File type ${extension} not supported`);
//       }
//     } else {
//       throw new BadRequestException('Required file');
//     }

//     return value;
//   }
// }
