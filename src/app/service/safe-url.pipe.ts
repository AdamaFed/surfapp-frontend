// // safe-url.pipe.ts
// import { Pipe, PipeTransform } from '@angular/core';
// import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
//
// @Pipe({ name: 'safeUrl' })
// export class SafeUrlPipe implements PipeTransform {
//     constructor(protected sanitizer: DomSanitizer) {}
//
//     public transform(value: string): SafeResourceUrl {
//         return this.sanitizer.bypassSecurityTrustResourceUrl(value);
//     }
// }
