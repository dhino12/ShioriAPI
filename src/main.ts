import { logger } from "./app/logging";
import { router as web } from "./app/router";

web.listen(3000, () => {
    logger.info("Listening on port 3000");
})