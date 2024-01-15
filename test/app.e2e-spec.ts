import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service'
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto/edit-dto';
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto';

describe('app e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService
  
  beforeAll(async () => {
    const moduleRef = 
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();


      app = moduleRef.createNestApplication();
      
      
      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
        })
      );
      await app.init();
      await app.listen(3333)

      prisma = app.get(PrismaService);
      await prisma.cleanDb();
      pactum.request.setBaseUrl('http://localhost:3333')
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    
    const dto: AuthDto = {
      email: 'dddd@gmail.com',
      password: '1234'
    };
    
    describe('Signup', () => { 
      it('should throw if email empty', () => {
        return pactum
        .spec()
        .post(
          '/auth/signup'
        )
        .withBody(
          {
            password: dto.password
          }
        )
        .expectStatus(400)
        })

        it('should throw if pass empty', () => {
          return pactum
          .spec()
          .post(
            '/auth/signup'
          )
          .withBody(
            {
              email: dto.email
            }
          )
          .expectStatus(400)
          })

          it('should throw if no body', () => {
            return pactum
            .spec()
            .post(
              '/auth/signup'
            )
            .expectStatus(400)
            })
      })
      
      it('should signup', () => {
        return pactum
        .spec()
        .post(
          '/auth/signup'
        )
        .withBody(dto)
        .expectStatus(201)
        .inspect();
      })

    describe('Sign in', () => {
      it('should throw if email empty', () => {
        return pactum
        .spec()
        .post(
          '/auth/signin'
        )
        .withBody(
          {
            password: dto.password
          }
        )
        .expectStatus(400)
        })

        it('should throw if pass empty', () => {
          return pactum
          .spec()
          .post(
            '/auth/signin'
          )
          .withBody(
            {
              email: dto.email
            }
          )
          .expectStatus(400)
          })

          it('should throw if no body', () => {
            return pactum
            .spec()
            .post(
              '/auth/signin'
            )
            .expectStatus(400)
            })


      it('should sigin', () => {
        return pactum 
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token')

      })

    })
  })

  describe('User', () => { 
    describe('Get me', () => { 
      it('should get current user', () => {
        return pactum
        .spec()
        .get('/users/me')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(200)
        .inspect()
      })
    })
    
    describe('Edit user', () => {
      it('should edit user', () => {
        const dto: EditUserDto = {
          firstName: 'sajjad',
          lastName: 'sa',
          email: 'dddd@gmail.com',
        };
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.email)
          .expectBodyContains(dto.firstName)
      });
    });
   })


   describe('Bookmarks', () => {

    describe('Get empty bookmarks', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBody([])
          .inspect()

      });
    });

      describe('create bookmark', () => {

        const dto: CreateBookmarkDto = {
          title: 'first bookmark',
          link: 'sample url',
        }

        it('shoud create bookmark', () => {
          return pactum
            .spec()
            .post('/bookmarks')
            .withHeaders({
              Authorization: 'Bearer $S{userAt}'
            })
            .withBody(dto)
            .expectStatus(201)
            .stores('bookmarkId', 'id')
            .inspect()
        })
      })

      describe('get bookmark', () => { 
        it('should get bookmarks', () => {
          return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(1)
          .inspect();
        })
      })

      describe('get bookmark by id', () => { 
        it('should get bookmark by id', () => {
          return pactum
          .spec()
          .get(`/bookmarks/{id}`)
          .withPathParams(`id`, `$S{bookmarkId}`)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBodyContains(`$S{bookmarkId}`)
          .inspect()
        })
      })

      describe('edit bookmark', () => { 
        
        const dto: EditBookmarkDto = {
          title: 'this is a new title',
          description: 'this is a new desc',
        }

        it('should edit bookmark by id', () => {
          return pactum
          .spec()
          .patch(`/bookmarks/{id}`)
          .withPathParams(`id`, `$S{bookmarkId}`)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description)
          .inspect()
        })
      })


      describe('delete bookmark', () => { 
        it('should delete bookmark by id', () => {
          return pactum
          .spec()
          .delete(`/bookmarks/{id}`)
          .withPathParams(`id`, `$S{bookmarkId}`)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(204)
          .inspect();
        });

        it('should get empty bookmarks', () => {
          return pactum
            .spec()
            .get('/bookmarks')
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .expectStatus(200)
            .expectJsonLength(0);
        });
      });
    });
  
  it.todo('should pass');
})
