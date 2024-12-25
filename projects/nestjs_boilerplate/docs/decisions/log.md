# Decisions

- [2024.12.24 - ULID](#20241224---ulid)
- [2024.12.24 - NestJS vs NextJS -\> Nest 사용하기로.](#20241224---nestjs-vs-nextjs---nest-사용하기로)
- [2024.12.25 - 로깅 라이브러리: Pino](#20241225---로깅-라이브러리-pino)
- [2024.12.25 - 로깅 레벨](#20241225---로깅-레벨)
- [2024.12.25 - 스키마](#20241225---스키마)

## 2024.12.24 - ULID

1. Sortable.
2. Compact(then uuid)

## 2024.12.24 - NestJS vs NextJS -> Nest 사용하기로.

NestJS 사용해서 Backend 구현하기로 결정. NextJS API Route, Server action 사용해도 Clean architecture건 뭐건 다 깔끔하게 구현할 수는 있음.

그러나 Worker나 이런 처리가 애매하고, **Dependency Injection**을 추가로 구현해야하는 이슈 등이 있음.

가장 큰 이유. **NestJS가 제공해주는 구조를 버리기엔, 너무 강력함.** 특히 AI 시대에서 더 두드러짐. 얘가 활동할 수 있는 **범위를 제한해주는 가드레일** 같은 역할을 해준다.

AI 시대에서 우리가 할 수 있는건 체계를 쌓고, 그걸 자동화 하는 것 밖에 없을 것 같다. **체계를 쌓고, 템플릿을 쌓아야지** 빠르게 갈 수 있다.

그런 면에서 NestJS가 처음에는 시간이 조금 더 걸릴 수는 있다. 그러나 한번 기초를 쌓아두면 정말 어마어마한 자산이 될 것이라 믿어 의심치 않음. 쉬운 길보다 어려운길로 갔을때 돌아보면 더 좋은 선택이었다는 말도 하지 않던가.

그리고 AI 덕분에 그리 어렵지도 않게 되어버림.

## 2024.12.25 - 로깅 라이브러리: Pino

NestJS: Pino

| Feature              | Pino                                              | Winston                                             |
| -------------------- | ------------------------------------------------- | --------------------------------------------------- |
| Performance          | Significantly Faster                              | Slower                                              |
| Log Format           | Primarily JSON (structured)                       | Customizable (JSON, text, custom)                   |
| Transports           | Growing selection                                 | Extensive selection                                 |
| Maturity             | Mature, but younger than Winston                  | Very mature, widely adopted                         |
| Complexity           | Generally simpler                                 | Can be complex due to extensive features            |
| Ideal Use Cases      | Performance-critical, cloud-native, microservices | General-purpose, legacy applications, diverse needs |
| Asynchronous Logging | Built-in Asynchronous Mode                        | Possible via Transports                             |

## 2024.12.25 - 로깅 레벨

500 미만: info
500 이상: error

## 2024.12.25 - 스키마
