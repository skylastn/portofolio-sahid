# Path ke data-source
DATA_SOURCE=src/system/data_source.ts
MIGRATION_DIR=./src/system/migrations

# Generate migration
migration:
	@if [ -z "$(name)" ]; then \
		echo "Usage: make migration name=user_table"; \
	else \
		npm run typeorm -- migration:generate $(MIGRATION_DIR)/$(name) -d $(DATA_SOURCE); \
	fi

# Run all migrations
migrate:
	npm run typeorm -- migration:run -d $(DATA_SOURCE)


# Revert last migration
migrate-revert:
	npm run typeorm -- migration:revert -d $(DATA_SOURCE)

deploy:
	docker-compose down && docker-compose build && docker-compose up -d

startSeeder:
	npm run seed

freshInstall:
	rm -rf node_modules package-lock.json
	npm install