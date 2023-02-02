from dependency_injector import containers, providers
import sys
sys.path.append("C:\\Users\\Kevin\\Projects\\arist-labs\\backend")
from domain.services.TranspilerService import TranspilerService

class Container(containers.DeclarativeContainer):
    transpiler_service = providers.Factory(
        TranspilerService
    )