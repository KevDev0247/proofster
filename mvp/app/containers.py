from dependency_injector import containers, providers
import sys
sys.path.append("C:\\Users\\Kevin\\Projects\\arist-labs\\backend")
from domain.services.TranspilerService import TranspilerService

class Container(containers.DeclarativeContainer):
    wiring_config = containers.WiringConfiguration(modules=[".controllers.FormulaController"])
    config = providers.Configuration()

    transpiler_service = providers.Factory(
        TranspilerService
    )
