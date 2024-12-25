# Guideline

## Migration

처음 Migration: `yarn migration:create`
이후 Migration: `yarn migration:generate`
실행: `yarn migration:run`

개발 Pase: `yarn schema:sync` 사용 - Migration 없이 DB 즉시 반영

## Scripting

기본적으로 package.json을 통해서 관리됩니다.

Production 환경에서 실행되면 안되는 스크립트는

`yarn ensure_env development`를 통해 체크 후 실행해야 합니다.

NODE_ENV를 확인해 스크립트 실행을 방지합니다.
