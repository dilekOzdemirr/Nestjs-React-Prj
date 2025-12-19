import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as fs from 'fs';

//200 harici status'larda resmi silen kod
@Injectable()
export class FileCleanupInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe( //işlem akışını dinlemeye başlıyoruz
      catchError((error) => { //eğer hata yakalanırsa
        const request = context.switchToHttp().getRequest();
        
        if (request.file) { //istekte bir dosya var mı?
           try {
             if (fs.existsSync(request.file.path)) {    //dosya fiziksel olarak orda mi
                fs.unlinkSync(request.file.path); //ordaysa sil
             }
           } catch(e) {
             console.error("Dosya silinirken hata oldu:", e);
           }
        }
        //dosya silinirken hata olusursa fırlatalım ki kullanıcı da görsün
        return throwError(() => error);
      }),
    );
  }
}